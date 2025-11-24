import AdminHomeVue from "@/pages/admin/AdminHome.vue";
import LoginAdminVue from "@/pages/admin/LoginAdmin.vue";
import Dashboard_admin from "@/pages/admin/Dashboard_admin.vue";
import ReservationsVue from "@/pages/admin/Reservations.vue";
import SettingsVue from "@/pages/admin/Settings.vue";
import WorkersVue from "@/pages/admin/Workers.vue";
import InquiriesVue from "@/pages/admin/Inquiries.vue";
import CustomerCommunicationVue from "@/pages/admin/CustomerCommunication.vue";
import CalendarVue from "@/pages/worker/Calendar.vue";
import DashboardVue from "@/pages/worker/Dashboard.vue";
import DetailVue from "@/pages/worker/Detail.vue";
import JobsVue from "@/pages/worker/Jobs.vue";
import PaymentVue from "@/pages/worker/Payment.vue";
import W_LoginVue from "@/pages/worker/W_Login.vue";
import HomeVue from "@/views/Home.vue";
import ReserVue from "@/views/Reser.vue";
import ReviewVue from "@/views/Review.vue";
import { createRouter, createWebHistory } from "vue-router";
import CustomersVue from "@/pages/admin/Customers.vue";
const routes = [
  { path: "/", component: HomeVue, name: "HomeVue" },
  { path: "/reser", component: ReserVue, name: "ReserVue" },
  { path: "/review", component: ReviewVue, name: "ReviewVue" },
  // 기사페이지 로그인
  {
    path: "/worker",
    name: "W_LoginVue",
    component: W_LoginVue,
  },
  // 기사 페이지
  {
    path: "/worker/dashboard",
    component: DashboardVue,
    redirect: "/worker/dashboard/jobs",
    children: [
      {
        path: "jobs",
        name: "MobileJobs",
        component: JobsVue,
      },
      {
        path: "calendar",
        name: "MobileCalendar",
        component: CalendarVue,
      },
      {
        path: "payment",
        name: "MobilePayment",
        component: PaymentVue,
      },
      {
        path: "detail/:id?",
        name: "MobileDetail",
        component: DetailVue,
      },
    ],
  },
  // 관리자페이지
  {
    path: "/admin",
    name: "LoginAdmin",
    component: LoginAdminVue,
  },
  // 관리자 페이지
  {
    path: "/admin",
    component: AdminHomeVue,
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        component: Dashboard_admin,
      },

      {
        path: "settings",
        component: SettingsVue,
      },
      {
        path: "customers",
        component: CustomersVue,
      },
      {
        path: "workers",
        component: WorkersVue,
      },
      {
        path: "reservations",
        component: ReservationsVue,
      },
      {
        path: "inquiries",
        component: InquiriesVue,
      },
      {
        path: "customer-communication",
        component: CustomerCommunicationVue,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
