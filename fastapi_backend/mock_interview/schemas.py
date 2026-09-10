# schemas.py

from uuid import UUID
from pydantic import BaseModel, Field

class NextQt(BaseModel):
    session_id: UUID
    first_question: str = Field(min_length=1, max_length=4_000)
    answer: str = Field(min_length=1, max_length=12_000)
