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
        <p>Yêu cầu của bạn đang ở trạng thái chờ. Hệ thống sẽ sớm xác nhận lại với bạn qua email.</p>
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

const sendEmailConfirmAppointment = async (idAppoinment) => {
  try {
    const appointment = await getAppointmentById(idAppoinment);
    const data = appointment.data;
    const email = data?.user?.email;
    if (!email) {
      return false;
    }
    await transporter.sendMail({
      from: `"Phòng khám Đa khoa" `,
      to: email,
      subject: "Xác nhận lịch hẹn",
      html: `
        <h3>Xin chào</h3>
        <p>Lịch hẹn của bạn với ${data.doctor ? `bác sĩ ${data?.doctor?.user?.firstName} ${data?.doctor?.user?.lastName}` : `gói khám ${data?.medical_package?.name}`} vào khung giờ ${data.time} ngày ${new Date(data.appointment_date).toLocaleDateString("en-GB")} đã được xác nhận.</p>
        <p>Vui lòng đến đúng giờ để được phục vụ tốt nhất. Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ y tế</p>
      `,
    });
    console.log("Email đã được gửi thành công!");
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi email xác nhận lịch hẹn: ", error);
    return false;
  }
};

const sendEmailDoneAppointment = async (idAppoinment) => {
  try {
    const appointment = await getAppointmentById(idAppoinment);
    const data = appointment.data;
    const email = data?.user?.email;
    if (!email) {
      return false;
    }
    await transporter.sendMail({
      from: `"Phòng khám Đa khoa" `,
      to: email,
      subject: "Thông báo lịch hẹn đã hoàn thành",
      html: `
        <h3>Xin chào</h3>
        <p>Lịch hẹn của bạn với ${data.doctor ? `bác sĩ ${data?.doctor?.user?.firstName} ${data?.doctor?.user?.lastName}` : `gói khám ${data?.medical_package?.name}`} vào khung giờ ${data.time} ngày ${new Date(data.appointment_date).toLocaleDateString("en-GB")} đã được hoàn thành.</p>
        <p>Chúng tôi hy vọng bạn đã có trải nghiệm tốt và nhận được sự chăm sóc y tế cần thiết. Nếu bạn có bất kỳ phản hồi nào hoặc cần hỗ trợ thêm, xin vui lòng liên hệ với chúng tôi.</p>  
        <p>Trân trọng,</p>
        <p>Đội ngũ y tế</p>
      `,
    });
    console.log("Email khám xong đã được gửi thành công!");
    return true;
  } catch (error) {
    console.error(
      "Lỗi khi gửi email thông báo lịch hẹn đã hoàn thành: ",
      error,
    );
    return false;
  }
};

const sendEmailCancelAppointment = async (idAppoinment, reason) => {
  try {
    const appointment = await getAppointmentById(idAppoinment);
    const data = appointment.data;
    const email = data?.user?.email;
    if (!email) {
      return false;
    }
    await transporter.sendMail({
      from: `"Phòng khám Đa khoa" `,
      to: email,
      subject: "Thông báo lịch hẹn đã bị hủy",
      html: `
        <h3>Xin chào</h3>
        <p>Lịch hẹn của bạn với ${data.doctor ? `bác sĩ ${data?.doctor?.user?.firstName} ${data?.doctor?.user?.lastName}` : `gói khám ${data?.medical_package?.name}`} vào khung giờ ${data.time} ngày ${new Date(data.appointment_date).toLocaleDateString("en-GB")} đã bị hủy.</p>
        <p>Lý do hủy: ${reason}</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ y tế</p>
      `,
    });
    console.log("Email đã được gửi thành công!");
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi email thông báo lịch hẹn đã bị hủy: ", error);
    return false;
  }
};

export {
  sendEmailCreatedAppointment,
  sendEmailConfirmAppointment,
  sendEmailDoneAppointment,
  sendEmailCancelAppointment,
};
