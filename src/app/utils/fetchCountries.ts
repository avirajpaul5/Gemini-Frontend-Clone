export type Country = {
  name: string;
  code: string;
  dialCode: string;
};

type RestCountryV2 = {
  name: string;
  alpha2Code: string;
  callingCodes: string[];
};

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch("https://restcountries.com/v2/all");
  if (!res.ok) throw new Error("Failed to fetch countries");
  const data = await res.json();

  return (data as RestCountryV2[])
    .map((c) => ({
      name: c.name,
      code: c.alpha2Code,
      dialCode:
        c.callingCodes && c.callingCodes[0] ? `+${c.callingCodes[0]}` : null,
    }))
    .filter((c): c is Country => !!c.dialCode)
    .sort((a, b) => a.name.localeCompare(b.name));
}
