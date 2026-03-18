import io
from llama_cloud import LlamaCloud
from dotenv import load_dotenv
import os
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl
load_dotenv()
client = LlamaCloud(api_key=os.getenv("LLAMAPARSE_KEY"))

if(not client):
    print("Client not initialized")


class ResumeSchema(BaseModel):
    full_name: str = Field(..., description="First and last name")
    email: str = Field(..., description="Valid email address")
    phone: Optional[str] = Field(None, description="Contact phone number")
    location: Optional[str] = Field(None, description="City and State/Country")
    linkedin_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None

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