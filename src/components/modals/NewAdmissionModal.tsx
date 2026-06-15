import {
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "sonner";

const grades = Array.from({ length: 10 }, (_, index) => `Grade ${index + 1}`);
const controlClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500";

export function NewAdmissionModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const submit = () => {
    onClose();
    toast.success("✓ Admission application submitted successfully");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative my-auto max-h-[85vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="p-6">
          <h2 className="mb-1 pr-10 text-xl font-semibold text-gray-900">New Student Admission</h2>
          <p className="mb-6 text-sm text-gray-500">Register a new student application</p>
          <Divider>Student Details</Divider>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Full Name" required>
              <Input placeholder="e.g. Aarav Sharma" />
            </Field>
            <Field label="Date of Birth" required>
              <Input type="date" />
            </Field>
            <Field label="Gender" required>
              <Select defaultValue="">
                <option value="" disabled>
                  Select gender
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Aadhar Number">
              <Input placeholder="12-digit Aadhar number" />
            </Field>
            <Field label="Previous School">
              <Input placeholder="Name of last school attended" />
            </Field>
            <Field label="Grade Applying For" required>
              <Select defaultValue="">
                <option value="" disabled>
                  Select grade
                </option>
                {grades.map((grade) => (
                  <option key={grade}>{grade}</option>
                ))}
              </Select>
            </Field>
            <Field label="Section Preference">
              <Select defaultValue="No Preference">
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>No Preference</option>
              </Select>
            </Field>
          </div>
          <Divider>Parent / Guardian Details</Divider>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Father's Name" required>
              <Input />
            </Field>
            <Field label="Mother's Name">
              <Input />
            </Field>
            <Field label="Primary Contact Number" required>
              <Input type="tel" placeholder="10-digit mobile number" />
            </Field>
            <Field label="Alternate Contact Number">
              <Input type="tel" />
            </Field>
            <Field label="Email Address">
              <Input type="email" />
            </Field>
            <Field label="Home Address" required>
              <Textarea rows={2} />
            </Field>
          </div>
          <Divider>Documents Checklist</Divider>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
            {["Birth Certificate", "Previous School TC", "Aadhar Copy", "Passport Photo"].map(
              (item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  {item}
                </label>
              ),
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700"
              onClick={submit}
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Divider({ children }: { children: string }) {
  return (
    <div className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </div>
  );
}
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}
function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}
function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}
