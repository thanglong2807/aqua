'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Option = {
  value: string;
  label: string;
};

type AutoFilterSelectProps = {
  name: string;
  value: string;
  defaultValueToOmit?: string;
  options: Option[];
  className?: string;
};

const AutoFilterSelect = ({
  name,
  value,
  defaultValueToOmit,
  options,
  className,
}: AutoFilterSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (defaultValueToOmit && nextValue === defaultValueToOmit) {
      params.delete(name);
    } else {
      params.set(name, nextValue);
    }

    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <select
      name={name}
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default AutoFilterSelect;
