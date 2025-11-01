function AppointmentsOfPatient({ setIsShow }) {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setIsShow(false)
                }
            }}>
            <div className="bg-white h-screen w-3/12 animate-slide-right">
                <h4>Xem chi tiết lịch dã khám của bênh nhân </h4>
            </div>
        </div>
    );
}

export default AppointmentsOfPatient;