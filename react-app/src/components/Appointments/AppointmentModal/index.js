import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createAppointmentThunk, updateAppointmentThunk } from "../../../store/appointments";
import { setHospitalsThunk } from "../../../store/hospitals";
import { setPhysiciansThunk } from "../../../store/physicians";
import DatePicker from "react-datepicker"
import "./AppointmentModal.css"
import "./react-datepicker.css"




const AppointmentForm = ({ appointment, formType }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    let appointmentId;
    if (appointment.id) appointmentId = appointment.id;

    const [physicianId, setPhysicianId] = useState(appointment.physicianId);
    const [hospitalId, setHospitalId] = useState(appointment.hospitalId);
    const [reasonForVisit, setReasonForVisit] = useState(appointment.reasonForVisit);
    const [startTime, setStartTime] = useState(appointment.startTime);
    const [startDate, setStartDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState(appointment.startTime);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const times = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]

    useEffect(() => {
        const errorsObj = {};
        if (physicianId === "") {
            errorsObj.physicianId = "Physician is required";
        };
        if (hospitalId === "") {
            errorsObj.hospitalId = "Hospital is required";
        };
        if (reasonForVisit.trim().length === 0) {
            errorsObj.reasonForVisit = "Cannot only be whitespace";
        };
        if (reasonForVisit === "") {
            errorsObj.reasonForVisit = "Reason for visit is required";
        };
        if (startTime.length === 0) {
            errorsObj.startTime = "Start Time is required";
        };
        setErrors(errorsObj);
    }, [physicianId, hospitalId, reasonForVisit, startTime]);

    useEffect(() => {
        dispatch(setHospitalsThunk())
        dispatch(setPhysiciansThunk())
    }, [dispatch])



    const hospitalsState = useSelector((state) => state.hospitals)
    const physiciansState = useSelector((state) => state.physicians.allPhysicians)
    if (!hospitalsState) return <h1>Loading...</h1>
    if (!physiciansState) return <h1>Loading...</h1>
    const hospitals = Object.values(hospitalsState)
    const physicians = Object.values(physiciansState)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const appointmentData = {
            id: appointmentId,
            physician_id: physicianId,
            hospital_id: hospitalId,
            reason_for_visit: reasonForVisit,
            start_time: startTime,
            end_time: startTime
        };

        if (Object.values(errors).length === 0) {
            if (formType === "Book") {
                await dispatch(createAppointmentThunk(appointmentData))
            };
            if (formType === "Update") {
                await dispatch(updateAppointmentThunk(appointmentData))
            };
            closeModal()
        }
        setHasSubmitted(true);
    };

    const appointmentCheck = (time) => {
        if (appointmentTime === time) return "appointment-time selected-time";
        else return "appointment-time";
    }

    return (
        <div className="appointment-form-modal">
            <h2>{`${formType} Your Appointment`}</h2>
            <div className="appointment-form-container">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    inline
                />
                <form onSubmit={handleSubmit} className="appointment-form" id="appointment-form">
                    <label>
                        Physician
                    </label>
                    <select
                        value={physicianId}
                        onChange={e => {
                            setHospitalId(physiciansState[e.target.value]?.hospital.id || "")
                            setPhysicianId(e.target.value)
                        }
                        }>
                        <option value="">Select an Option</option>
                        {physicians.map((physician) => (
                            <option value={physician.id} key={physician.id}>
                                {`${physician.first_name} ${physician.last_name}`}
                            </option>
                        ))}
                    </select>
                    {hasSubmitted && (<p className="error">{errors.physicianId}</p>)}
                    <label>
                        Hospital
                    </label>
                    <select
                        value={hospitalId}
                        onChange={e => {
                            setPhysicianId(hospitalsState[e.target.value].physicians[0]?.id || "")
                            setHospitalId(e.target.value)
                        }
                        }>
                        <option value="">Select an Option</option>
                        {hospitals.map((hospital) => (
                            <option value={hospital.id} key={hospital.id}>
                                {hospital.name}
                            </option>
                        ))}
                    </select>
                    {hasSubmitted && (<p className="error">{errors.hospitalId}</p>)}
                    <label>
                        Reason For Visit
                    </label>
                    <textarea
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        rows="5" cols="33"
                    >
                    </textarea>
                    {hasSubmitted && (<p className="error">{errors.reasonForVisit}</p>)}
                </form>
            </div>
            <label>
                Appointment Time
            </label>
            <div className="appointment-times-grid">
                {times.map((time) => (
                    <div
                        onClick={() => setAppointmentTime(time)}
                        className={appointmentCheck(time)}
                    >
                        <h2>{time}</h2>
                    </div>
                )
                )}
            </div>
            {hasSubmitted && (<p className="error">{errors.startTime}</p>)}
            <button
                type="submit"
                form="appointment-form"
                disabled={hasSubmitted && Object.values(errors).length !== 0}
            >{`${formType} Appointment`}</button>
        </div>
    )
}

export default AppointmentForm