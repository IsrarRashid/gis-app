import React, { useState } from "react";

// Define the option type
interface OptionType {
  value: string | number;
  label: string;
  isDisabled?: boolean;
}

// Mock CustomSelect component for demonstration
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  isMulti = false,
  isDisabled = false,
  isLoading = false,
  isClearable = false,
  ...props
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #eff0f2",
          borderRadius: "7px",
          fontSize: "14px",
          backgroundColor: "#f9fafb",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );
  }

  if (isMulti) {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "100%",
            minHeight: "38px",
            padding: "4px 8px",
            border: "1px solid #eff0f2",
            borderRadius: "7px",
            fontSize: "14px",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "center",
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.6 : 1,
            backgroundColor: isDisabled ? "#f9fafb" : "white",
          }}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
        >
          {value && value.length > 0 ? (
            value.map((item: OptionType, index: number) => (
              <span
                key={index}
                style={{
                  backgroundColor: "#E4EDEC",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {item.label}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "10px",
                    color: "#666",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newValue = value.filter(
                      (_: any, i: number) => i !== index
                    );
                    onChange(newValue, { action: "remove-value" });
                  }}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span style={{ color: "#999" }}>{placeholder}</span>
          )}
          <span style={{ marginLeft: "auto", fontSize: "12px" }}>▼</span>
        </div>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "7px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {options.map((option: OptionType) => (
              <div
                key={option.value}
                style={{
                  padding: "8px 12px",
                  cursor: option.isDisabled ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  opacity: option.isDisabled ? 0.5 : 1,
                  backgroundColor: value?.some(
                    (v: OptionType) => v.value === option.value
                  )
                    ? "#E4EDEC"
                    : "transparent",
                }}
                onClick={() => {
                  if (!option.isDisabled) {
                    const isSelected = value?.some(
                      (v: OptionType) => v.value === option.value
                    );
                    let newValue;
                    if (isSelected) {
                      newValue = value.filter(
                        (v: OptionType) => v.value !== option.value
                      );
                    } else {
                      newValue = value ? [...value, option] : [option];
                    }
                    onChange(newValue, {
                      action: isSelected ? "remove-value" : "select-option",
                    });
                  }
                }}
                onMouseEnter={(e) => {
                  if (!option.isDisabled) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    !value?.some((v: OptionType) => v.value === option.value)
                  ) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #eff0f2",
          borderRadius: "7px",
          fontSize: "14px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDisabled ? "#f9fafb" : "white",
          opacity: isDisabled ? 0.6 : 1,
        }}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
      >
        <span style={{ color: value ? "#333" : "#999" }}>
          {value ? value.label : placeholder}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {isClearable && value && (
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#666",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onChange(null, { action: "clear" });
              }}
            >
              ×
            </button>
          )}
          <span style={{ fontSize: "12px" }}>▼</span>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "7px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((option: OptionType) => (
            <div
              key={option.value}
              style={{
                padding: "8px 12px",
                cursor: option.isDisabled ? "not-allowed" : "pointer",
                fontSize: "14px",
                opacity: option.isDisabled ? 0.5 : 1,
              }}
              onClick={() => {
                if (!option.isDisabled) {
                  onChange(option, { action: "select-option" });
                  setIsOpen(false);
                }
              }}
              onMouseEnter={(e) => {
                if (!option.isDisabled) {
                  e.currentTarget.style.backgroundColor = "#E4EDEC";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
// Custom styles interface for demonstration
interface CustomStyles {
  control?: any;
  dropdownIndicator?: any;
  clearIndicator?: any;
  valueContainer?: any;
  input?: any;
  menu?: any;
  menuPortal?: any;
  option?: any;
}

// Mock custom styles object
const customSelectStyles: CustomStyles = {
  control: (base: any, state: any) => ({
    ...base,
    fontSize: "14px",
    borderRadius: 7,
    border: state.isFocused ? "1px solid #0c8ce9" : "1px solid #eff0f2",
    boxShadow: state.isFocused ? "0 0 0 1px rgba(12, 140, 233, 0.4)" : "none",
    "&:hover": {
      border: "1px solid #0c8ce9",
      boxShadow: "0 0 0 1px rgba(12, 140, 233, 0.4)",
    },
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: 10.5,
  }),
  clearIndicator: (base: any) => ({
    ...base,
    padding: 4,
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 6px",
  }),
  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    padding: "4px 8px",
    borderRadius: 14,
    border: 0,
    boxShadow: "0px 0px 7px 3px rgba(0,0,0,0.1)",
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#E4EDEC" : "white",
    color: "#333",
    fontSize: "14px",
    padding: "10px",
    borderRadius: 7,
  }),
};

// Usage Example Component
// const SelectUsageExample: React.FC = () => {
//   // Sample options
//   const districtOptions: OptionType[] = [
//     { value: "karachi", label: "Karachi" },
//     { value: "lahore", label: "Lahore" },
//     { value: "islamabad", label: "Islamabad" },
//     { value: "rawalpindi", label: "Rawalpindi" },
//     { value: "faisalabad", label: "Faisalabad" },
//     { value: "multan", label: "Multan", isDisabled: true },
//   ];

//   const commissionerOptions: OptionType[] = [
//     { value: 1, label: "John Doe" },
//     { value: 2, label: "Jane Smith" },
//     { value: 3, label: "Ali Ahmed" },
//     { value: 4, label: "Sara Khan" },
//   ];

//   const multiSelectOptions: OptionType[] = [
//     { value: "option1", label: "Option 1" },
//     { value: "option2", label: "Option 2" },
//     { value: "option3", label: "Option 3" },
//     { value: "option4", label: "Option 4" },
//     { value: "option5", label: "Option 5" },
//   ];

//   // State management
//   const [selectedDistrict, setSelectedDistrict] = useState<OptionType | null>(
//     null
//   );
//   const [selectedCommissioner, setSelectedCommissioner] =
//     useState<OptionType | null>(null);
//   const [selectedMultiOptions, setSelectedMultiOptions] = useState<
//     OptionType[]
//   >([]);

//   // Event handlers for demonstration
//   const handleDistrictChange = (newValue: OptionType | null) => {
//     setSelectedDistrict(newValue);
//     console.log("District changed:", newValue);
//   };

//   const handleCommissionerChange = (newValue: OptionType | null) => {
//     setSelectedCommissioner(newValue);
//     console.log("Commissioner changed:", newValue);
//   };

//   const handleMultiSelectChange = (newValue: OptionType[]) => {
//     setSelectedMultiOptions(newValue);
//     console.log("Multi-select changed:", newValue);
//   };

//   // Alternative custom styles for different variants
//   const successSelectStyles: CustomStyles = {
//     ...customSelectStyles,
//     control: (base: any, state: any) => ({
//       ...base,
//       fontSize: "14px",
//       borderRadius: 7,
//       border: state.isFocused ? "1px solid #10b981" : "1px solid #eff0f2",
//       boxShadow: state.isFocused ? "0 0 0 1px rgba(16, 185, 129, 0.4)" : "none",
//       "&:hover": {
//         border: "1px solid #10b981",
//         boxShadow: "0 0 0 1px rgba(16, 185, 129, 0.4)",
//       },
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isFocused ? "#d1fae5" : "white",
//       color: "#333",
//       fontSize: "14px",
//       padding: "10px",
//       borderRadius: 7,
//     }),
//   };

//   return (
//     <div className="container p-4">
//       <h4 className="mb-4">Reusable React Select Component Examples</h4>

//       <div className="row g-4">
//         {/* Basic Single Select */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <label
//               htmlFor="district"
//               className="form-label fw-bold mb-2"
//               style={{ fontSize: "14px", color: "#333" }}
//             >
//               Select District
//             </label>
//             <CustomSelect
//               id="district"
//               name="districtName"
//               options={districtOptions}
//               value={selectedDistrict}
//               onChange={handleDistrictChange}
//               placeholder="Choose a district..."
//               styles={customSelectStyles}
//               isClearable
//               isSearchable
//             />
//             {selectedDistrict && (
//               <small className="text-muted mt-1">
//                 Selected: {selectedDistrict.label} ({selectedDistrict.value})
//               </small>
//             )}
//           </div>
//         </div>

//         {/* Select with Success Theme */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <label
//               htmlFor="commissioner"
//               className="form-label fw-bold mb-2"
//               style={{ fontSize: "14px", color: "#333" }}
//             >
//               Select Commissioner
//             </label>
//             <CustomSelect
//               id="commissioner"
//               name="commissionerName"
//               options={commissionerOptions}
//               value={selectedCommissioner}
//               onChange={handleCommissionerChange}
//               placeholder="Choose a commissioner..."
//               styles={successSelectStyles}
//               isClearable
//               isSearchable
//             />
//             {selectedCommissioner && (
//               <small className="text-success mt-1">
//                 Selected: {selectedCommissioner.label} (ID:{" "}
//                 {selectedCommissioner.value})
//               </small>
//             )}
//           </div>
//         </div>

//         {/* Multi Select */}
//         <div className="col-12">
//           <div className="card p-3">
//             <label
//               htmlFor="multiSelect"
//               className="form-label fw-bold mb-2"
//               style={{ fontSize: "14px", color: "#333" }}
//             >
//               Multi Select Options
//             </label>
//             <CustomSelect
//               id="multiSelect"
//               name="multiSelectOptions"
//               options={multiSelectOptions}
//               value={selectedMultiOptions}
//               onChange={handleMultiSelectChange}
//               placeholder="Choose multiple options..."
//               styles={customSelectStyles}
//               isMulti
//               isClearable
//               isSearchable
//               closeMenuOnSelect={false}
//             />
//             {selectedMultiOptions.length > 0 && (
//               <small className="text-info mt-1">
//                 Selected {selectedMultiOptions.length} option(s):{" "}
//                 {selectedMultiOptions.map((opt) => opt.label).join(", ")}
//               </small>
//             )}
//           </div>
//         </div>

//         {/* Disabled Select */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <label
//               className="form-label fw-bold mb-2"
//               style={{ fontSize: "14px", color: "#666" }}
//             >
//               Disabled Select
//             </label>
//             <CustomSelect
//               options={districtOptions}
//               value={{ value: "lahore", label: "Lahore" }}
//               onChange={() => {}}
//               placeholder="This is disabled..."
//               styles={customSelectStyles}
//               isDisabled
//             />
//           </div>
//         </div>

//         {/* Loading Select */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <label
//               className="form-label fw-bold mb-2"
//               style={{ fontSize: "14px", color: "#333" }}
//             >
//               Loading Select
//             </label>
//             <CustomSelect
//               options={[]}
//               value={null}
//               onChange={() => {}}
//               placeholder="Loading options..."
//               styles={customSelectStyles}
//               isLoading
//               loadingMessage={() => "Fetching data..."}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Code Examples */}
//       <div className="mt-4">
//         <h5>Usage Examples:</h5>
//         <div className="bg-light p-3 rounded">
//           <h6>1. Basic Single Select:</h6>
//           <pre style={{ fontSize: "12px", margin: 0 }}>
//             {`const [selected, setSelected] = useState<OptionType | null>(null);

// <CustomSelect
//   options={options}
//   value={selected}
//   onChange={(newValue) => setSelected(newValue)}
//   placeholder="Select an option..."
//   styles={customSelectStyles}
// />`}
//           </pre>

//           <h6 className="mt-3">2. Multi Select:</h6>
//           <pre style={{ fontSize: "12px", margin: 0 }}>
//             {`const [selected, setSelected] = useState<OptionType[]>([]);

// <CustomSelect
//   options={options}
//   value={selected}
//   onChange={(newValue) => setSelected(Array.isArray(newValue) ? newValue : [])}
//   isMulti
// />`}
//           </pre>

//           <h6 className="mt-3">3. With Custom Styles:</h6>
//           <pre style={{ fontSize: "12px", margin: 0 }}>
//             {`const myStyles = {
//   control: (base, state) => ({
//     ...base,
//     borderColor: state.isFocused ? '#10b981' : '#e5e7eb',
//   }),
// };

// <CustomSelect styles={myStyles} ... />`}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectUsageExample;
