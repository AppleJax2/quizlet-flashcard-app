import{b as f,j as e,C as r,a,B as j}from"./index-f8d0b61e.js";import{r as g,L as l}from"./vendor-5b64d0ef.js";import{u as w}from"./index.esm-d2ec7ada.js";import{t as y}from"./index-033ed600.js";import{I as N,f as b}from"./Input-40f49692.js";function P(){var t;const{forgotPassword:o,error:s,isLoading:n,clearError:i}=f(),[m,d]=g.useState(!1),{register:c,handleSubmit:x,formState:{errors:u}}=w({resolver:y(b),defaultValues:{email:""}}),h=async p=>{i();try{await o(p),d(!0)}catch{}};return m?e.jsx("div",{className:"flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8",children:e.jsx(r,{className:"w-full max-w-md",children:e.jsxs(a,{className:"p-8",children:[e.jsxs("div",{className:"mb-8 text-center",children:[e.jsx("div",{className:"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-8 w-8 text-green-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})})}),e.jsx("h1",{className:"text-3xl font-bold text-neutral-900",children:"Check Your Email"}),e.jsx("p",{className:"mt-2 text-neutral-600",children:"We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password."})]}),e.jsx("div",{className:"mt-8 text-center",children:e.jsx(l,{to:"/login",className:"font-medium text-primary-600 hover:text-primary-700",children:"Back to Login"})})]})})}):e.jsx("div",{className:"flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8",children:e.jsx(r,{className:"w-full max-w-md",children:e.jsxs(a,{className:"p-8",children:[e.jsxs("div",{className:"mb-8 text-center",children:[e.jsx("h1",{className:"text-3xl font-bold text-neutral-900",children:"Forgot Password"}),e.jsx("p",{className:"mt-2 text-neutral-600",children:"Enter your email address and we'll send you a link to reset your password."})]}),s&&e.jsx("div",{className:"mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700",children:s}),e.jsxs("form",{onSubmit:x(h),className:"space-y-6",children:[e.jsx(N,{label:"Email",type:"email",error:(t=u.email)==null?void 0:t.message,fullWidth:!0,...c("email")}),e.jsx(j,{type:"submit",fullWidth:!0,isLoading:n,className:"py-2.5",children:"Send Reset Link"})]}),e.jsxs("div",{className:"mt-8 text-center text-sm text-neutral-600",children:["Remember your password?"," ",e.jsx(l,{to:"/login",className:"font-medium text-primary-600 hover:text-primary-700",children:"Log in"})]})]})})})}export{P as default};
//# sourceMappingURL=ForgotPasswordPage-e4c1f357.js.map
