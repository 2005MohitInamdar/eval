import io
import os
import uuid
import asyncio
import logging
from dotenv import load_dotenv
from fastapi import HTTPException
from typing import Optional, List
from llama_cloud import LlamaCloud
from llama_cloud import LlamaCloudError
from pydantic import BaseModel, Field

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

client = LlamaCloud(api_key=os.getenv("LLAMA_CLOUD_API_KEY"))
# print(dir(client))``
files = client.files.list()


if(not client):
    print("Client not initialized")

class EducationEntry(BaseModel):
    institution: str
    degree: Optional[str]
    percentage_or_cgpa: Optional[str]
    year_of_passing: Optional[str]

class ExperienceEntry(BaseModel):
    job_title: str
    company: str
    duration: Optional[str]
    description: List[str] = Field(description="Bullet points of responsibilities")
    
class SkillsEntry(BaseModel):
    soft_skills: List[str] = Field(..., description="all soft skills keywords")
    technical_skills: List[str] = Field(..., description="all technical skills keywords")
    
class ResumeSchema(BaseModel):
    full_name: str = Field(..., description="First and last name")
    email: str = Field(..., description="Valid email address")
    phone: Optional[str] = Field(None, description="Contact phone number")
    location: Optional[str] = Field(None, description="City and State/Country")
    projects: List[str] = Field(..., description="Titles and brief descriptions of projects")

    education: List[EducationEntry] = Field(default_factory=list)
    experience: List[ExperienceEntry] = Field(default_factory=list)
    skills: List[SkillsEntry] = Field(default_factory=list)

    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None


async def resume_Parser(fileBytes, fileName):
    source_buffer = io.BytesIO(fileBytes)

    _, ext = os.path.splitext(fileName.lower())

    mime_map = {
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",
        ".txt": "text/plain"
    }

    content_type = mime_map.get(ext, "application/octet-stream")

    file_tuple = (fileName, source_buffer, content_type)

    file_obj = client.files.create( 
        file=file_tuple,
        # external_file_id=fileName,
        external_file_id=str(uuid.uuid4()),
        purpose="extract"
    )
    try:
        job = client.extract.create(
            file_input = file_obj.id,
            configuration = {
                "data_schema":  ResumeSchema.model_json_schema(),
                "tier": "agentic"
            },
        )

        result = client.extract.wait_for_completion(job.id)
        # result = client.extraction.extract(
        #     file_id = file_obj.id,
        #     config = {},
        #     data_schema = ResumeSchema.model_json_schema()
        # )
        return result.extract_result
    except LlamaCloudError as e:
        logger.error(f"LlamaCloud error: {e}")
        return {"status": "error", "message": "Extraction failed"}
    except Exception as e:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")




# async def test():
#     file_path = "E:/resumes/ParthInamdar.pdf"

#     with open(file_path, "rb") as f:
#         file_bytes = f.read()

#     result = await resume_Parser(file_bytes, "E:/resumes/ParthInamdar.pdf" )
#     print(result)

# asyncio.run(test())
