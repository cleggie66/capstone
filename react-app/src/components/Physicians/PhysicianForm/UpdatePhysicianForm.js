import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import PhysicianForm from ".";


const UpdatePhysicianForm = () => {
    const dispatch = useDispatch();
    const { physicianId } = useParams()

    const physiciansState = useSelector(state => state.physicians.allPhysicians)
    const physicianData = physiciansState[physicianId]
    const physician = {
        id: physicianData.id,
        firstName: physicianData.first_name,
        lastName: physicianData.last_name,
        picture: physicianData.picture,
        hospitalId: physicianData.hospital_id,
        medicalSpecialtyId: physicianData.medical_specialty_id,
        medicalEducation: physicianData.medical_education,
        acceptsInsurance: physicianData.accepts_insurance,
        video: physicianData.video
    }

    return (
        <PhysicianForm physician={physician} formType="Update Physician" />
    )

}

export default UpdatePhysicianForm