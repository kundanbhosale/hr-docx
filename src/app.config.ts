import { env } from "./app/env";

export const appConfig = {
  title: {
    short: "HR Docx",
    full: "HR Docx App",
  },
  logo: {
    icon: "/app/ico.svg",
    logo: "/app/logo.png",
    logoWhite: "/app/logo-white.png",
  },
  plans: [
    {
      name: "Pay Per Doc",
      id: "ppd",
      prices: {
        inr: 299,
      },

      features: {
        documents: 1,
        downloads: 1,
        collaboration_access: 1,
        email_support: "basic",
        updates_new_docs: true,
        call_support: false,
        history_control: false,
        version_control: false,
      },
    },
    {
      name: "Quarterly",
      id: env.IN_PROD ? "plan_Q6DNQfQF1aTp6s" : "plan_PxUR9JHBuaKCOM",
      prices: {
        inr: 2999,
      },
      interval: {
        value: 3,
        frequency: "months",
      },

      features: {
        documents: -1,
        downloads: 60,
        collaboration_access: -1,
        email_support: "priority",
        updates_new_docs: true,
        call_support: false,
        history_control: false,
        version_control: false,
      },
    },
    {
      name: "Half Yearly",
      id: env.IN_PROD ? "plan_Q6DKyyEGep4N3x" : "plan_PxUR9JHBuaKCOM",
      prices: {
        inr: 4999,
      },
      interval: {
        value: 6,
        frequency: "months",
      },
      features: {
        documents: -1,
        downloads: 150,
        collaboration_access: -1,
        email_support: "priority",
        updates_new_docs: true,
        call_support: true,
        history_control: true,
        version_control: true,
      },
      bestValue: true,
    },
    {
      name: "Yearly",
      id: env.IN_PROD ? "plan_Q6DMJymKWmP8hN" : "plan_Q6DMJymKWmP8hN",
      prices: {
        inr: 9999,
      },
      interval: {
        value: 1,
        frequency: "year",
      },
      features: {
        documents: -1,
        downloads: 400,
        collaboration_access: -1,
        email_support: "priority",
        updates_new_docs: true,
        call_support: true,
        history_control: true,
        version_control: true,
      },
    },
  ],
};
