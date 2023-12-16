import { FC, FormEvent, useContext, useId, useState } from "react";
import { ApiClientContext } from "@/api/context";

import "./LoginForm.scss";

type InputProps = {
  value: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const FormInput: FC<InputProps> = ({ label, value, onChange }) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </>
  );
};

export const LoginForm = () => {
  const { initClient } = useContext(ApiClientContext);

  const [region, setRegion] = useState("eu-west-1");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucket, setBucket] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const success = await initClient({
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
    });

    if (!success) {
      alert("Failed to connect");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <FormInput label="Region" value={region} onChange={setRegion} required />
      <FormInput
        label="Access key ID"
        value={accessKeyId}
        onChange={setAccessKeyId}
        required
      />
      <FormInput
        label="Secret access key"
        value={secretAccessKey}
        onChange={setSecretAccessKey}
        required
      />
      <FormInput label="Bucket" value={bucket} onChange={setBucket} required />
      <button>Load Bucket</button>
    </form>
  );
};
