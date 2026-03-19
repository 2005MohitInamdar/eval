from typing import Optional, List
from pydantic import BaseModel, Field
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



structured_data = {'full_name': 'Utkarsh Chavan',
    'email': 'chavanutkarsh707@gmail.com',
    'phone': '9834548133',
    'location': 'Police Colony, N-10, Cidco, Chh. Sambhajinagar',
    'education': [{'institution': 'Defence Career Institute, Jr. College, Bhindon.', 
        'degree': 'Secondary School', 
        'percentage_or_cgpa': None, 
        'year_of_passing': '2023'}, 
        {
            'institution': 'MGM University, Chh. Sambhajinagar', 
            'degree': 'Bachelor of Technology (pursuing)', 
            'percentage_or_cgpa': None, 
            'year_of_passing': None
        }
        ],
        'skills': [
            {
                'soft_skills': [
                    'Design Thinking', 'Creative Thinking', 'Adaptability', 'Collaboration', 'Emotional Intelligence', 'Problem-Solving', 'Strong Communication'
                ], 
                'projects': []
            }, 
            {
                'soft_skills': [
                    'Project Management Tools'
                ], 
                'projects': []
            }, 
            {
                'soft_skills': [], 
                'projects': ['Web Design']
            }
        ], 
        'linkedin_url': None, 
        'github_url': None, 
        'portfolio_url': None
    }


test_resume = ResumeSchema(**structured_data)
print(test_resume)