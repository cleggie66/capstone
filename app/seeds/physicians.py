from app.models import db, Physician, environment, SCHEMA
from sqlalchemy.sql import text


def seed_physicians():
    doc1 = Physician(
        first_name="Nick", last_name="Riviera", picture="https://i.ytimg.com/vi/pGbN_hSotCo/sddefault.jpg", hospital_id=1, medical_specialty_id=1, medical_education="M.D.", accepts_insurance=True, video="https://youtu.be/W5R_jNLyPNw")
    doc2 = Physician(
        first_name="Christina", last_name="Yang", picture="https://upload.wikimedia.org/wikipedia/commons/d/d8/Cristina_Yang.jpg", hospital_id=1, medical_specialty_id=1, medical_education="PhD", accepts_insurance=True, video="https://youtu.be/dQw4w9WgXcQ")
    doc3 = Physician(
        first_name="Doogie", last_name="Howser", picture="https://m.media-amazon.com/images/M/MV5BNzk0ODYzNjkxNV5BMl5BanBnXkFtZTgwNDY3MTY1MTE@._V1_.jpg", hospital_id=1, medical_specialty_id=1, medical_education="M.D.", accepts_insurance=True, video="https://youtu.be/dQw4w9WgXcQ")
    doc4 = Physician(
        first_name="Jennifer", last_name="Melfi", picture="https://www.magicalquote.com/wp-content/uploads/2020/04/Jennifer-Melfi.jpg", hospital_id=1, medical_specialty_id=3, medical_education="M.D.", accepts_insurance=True, video="https://youtu.be/RZoKOPRk9pw")
    
    
    db.session.add(doc1)
    db.session.add(doc2)
    db.session.add(doc3)
    db.session.add(doc4)
    db.session.commit()


def undo_physicians():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.physicians RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM physicians"))

    db.session.commit()
