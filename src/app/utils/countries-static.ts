export type Country = {
  name: string;
  code: string;
  dialCode: string;
};

export const countries: Country[] = [
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Singapore", code: "SG", dialCode: "+65" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
];
