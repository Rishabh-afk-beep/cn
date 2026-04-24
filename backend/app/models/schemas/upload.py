from pydantic import BaseModel


class ImageUploadResponse(BaseModel):
    url: str
    public_id: str
    width: int
    height: int
    format: str
