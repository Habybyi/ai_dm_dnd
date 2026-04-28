export default function Input({
                                  id,
                                  type = "text",
                                  name,
                                  value,
                                  onChange,
                                  placeholder,
                                  required = false,
                                  error = false,
                              }) {
    return (
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            style={{
                backgroundColor: error ? "#5C1F1F" : "#2A2A2A",
                color: "#fff",//C8C0B8
                border: `1.5px solid ${error ? "#C0392B" : "#4A4A4A"}`,
                borderRadius: "999px",
                padding: "10px 20px",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                transition: "border-color 0.2s, background-color 0.2s",
            }}
            onFocus={(e) => {
                if (!error) e.target.style.borderColor = "#7A6A5A";
            }}
            onBlur={(e) => {
                if (!error) e.target.style.borderColor = "#4A4A4A";
            }}
        />
    );
}