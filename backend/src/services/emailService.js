require("dotenv").config();
import nodemailer from "nodemailer";
import { getAppointmentById } from "./appointmentService";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmailCreatedAppointment = async (idAppoinment) => {
  try {
    const appointment = await getAppointmentById(idAppoinment);
    const data = appointment.data;
    console.log("Data appointment for email: ", data);
    const email = data?.user?.email;
    if (!email) {
      return false;
    }
    await transporter.sendMail({
      from: `"Phòng khám Đa khoa" `,
      to: email,
      subject: "Xác nhận tạo lịch hẹn",
      html: `
        <h3>Xin chào</h3>
        ${data.doctor ? `<p>Bạn đã tạo một lịch hẹn với bác sĩ ${data?.doctor?.user?.firstName} ${data?.doctor?.user?.lastName} vào khung giờ ${data.time} ngày ${new Date(data.appointment_date).toLocaleDateString("en-GB")}.</p>` : `<p>Bạn đã tạo một lịch hẹn khám bệnh ${data?.medical_package?.name} vào khung giờ ${data.time} ngày ${new Date(data.appointment_date).toLocaleDateString("en-GB")}.</p>`}
        <p>Xin vui lòng đến đúng giờ để khám bệnh.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ y tế</p>
      `,
    });
    console.log("Email đã được gửi thành công!");
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi email tạo lịch hẹn: ", error);
    return false;
  }
};

export { sendEmailCreatedAppointment };
