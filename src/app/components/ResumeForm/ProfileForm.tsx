import { useState, useEffect } from "react";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, role, email, phone, url, summary, location } = profile;

  const [emailError, setEmailError] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  useEffect(() => {
    if (!email) {
      setEmailError("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(
        "Please enter a valid email address (e.g. name@domain.com)"
      );
    } else {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    if (!url) {
      setUrlError("");
      return;
    }
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!urlRegex.test(url)) {
      setUrlError("Please enter a valid URL (e.g. linkedin.com/in/username)");
    } else {
      setUrlError("");
    }
  }, [url]);

  return (
    <div className="grid grid-cols-6 gap-3">
      <div className="col-span-3 flex flex-col">
        <Input
          label="Name"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
      </div>
      <div className="col-span-3 flex flex-col">
        <Input
          label="Title / Role"
          name="role"
          placeholder="Founder & Executive Director"
          value={role}
          onChange={handleProfileChange}
        />
      </div>
      <div className="col-span-full">
        <Textarea
          label="Objective"
          name="summary"
          placeholder="Entrepreneur and educator obsessed with making education free for anyone"
          value={summary}
          onChange={handleProfileChange}
        />
      </div>
      <div className="col-span-4 flex flex-col">
        <Input
          label="Email"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        {emailError && (
          <p className="mt-1 text-sm font-normal text-red-500" role="alert">
            {emailError}
          </p>
        )}
      </div>
      <div className="col-span-2 flex flex-col">
        <Input
          label="Phone"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
      </div>
      <div className="col-span-4 flex flex-col">
        <Input
          label="Website / LinkedIn"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        {urlError && (
          <p className="mt-1 text-sm font-normal text-red-500" role="alert">
            {urlError}
          </p>
        )}
      </div>
      <div className="col-span-2 flex flex-col">
        <Input
          label="Location"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </div>
  );
};
