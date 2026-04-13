import io
from llama_cloud import LlamaCloud
from dotenv import load_dotenv
import os
from typing import Optional, List
from pydantic import BaseModel, Field, HttpUrl
load_dotenv()
client = LlamaCloud(api_key=os.getenv("LLAMAPARSE_KEY"))

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
        external_file_id=fileName,
        purpose="extract"
    )

    result = client.extraction.extract(
        file_id = file_obj.id,
        config = {},
        data_schema = ResumeSchema.model_json_schema()
    )
    return result