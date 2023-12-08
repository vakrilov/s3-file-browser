import { FunctionComponent, useState } from "react";

import "./LoginForm.scss";

type InputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const Input: FunctionComponent<InputProps> = ({
  value,
  placeholder,
  onChange,
}) => (
  <input
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

export type Credentials = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

type LoginFormProps = {
  onSubmit: (val: Credentials) => void;
};

export const LoginForm: FunctionComponent<LoginFormProps> = ({ onSubmit }) => {
  const [region, setRegion] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucket, setBucket] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ bucket, region, accessKeyId, secretAccessKey });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Input
        placeholder="Region"
        value={region}
        onChange={setRegion}
        required
      />
      <Input
        placeholder="Access key ID"
        value={accessKeyId}
        onChange={setAccessKeyId}
        required
      />
      <Input
        placeholder="Secret access key"
        value={secretAccessKey}
        onChange={setSecretAccessKey}
        required
      />
      <Input
        placeholder="Bucket"
        value={bucket}
        onChange={setBucket}
        required
      />
      <button>Load Bucket</button>
    </form>
  );
};
