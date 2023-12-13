import { FC, useId, useState } from "react";

import "./LoginForm.scss";
import { Credentials } from "../api/context";

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

type LoginFormProps = {
  onSubmit: (val: Credentials) => void;
};

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
  const [region, setRegion] = useState("eu-west-1");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucket, setBucket] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ bucket, region, accessKeyId, secretAccessKey });
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
