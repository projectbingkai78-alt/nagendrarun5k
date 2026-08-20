const API_URL =
  "https://run-registration-api.projectbingkai78.workers.dev";

const form =
  document.getElementById(
    "registrationForm"
  );

const statusBox =
  document.getElementById("status");


function setStatus(message) {
  statusBox.textContent = message;
}


function cleanText(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}


function cleanEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


function cleanPhone(value) {
  return String(value || "")
    .replace(/[^\d+]/g, "")
    .slice(0, 20);
}


form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    try {

      setStatus(
        "Memeriksa data pendaftaran..."
      );

      const turnstileToken =
        document.querySelector(
          '[name="cf-turnstile-response"]'
        )?.value;

      if (!turnstileToken) {
        throw new Error(
          "Silakan selesaikan verifikasi keamanan."
        );
      }

      const formData =
        new FormData(form);

      const payload = {

        action: "register",

        nama_lengkap:
          cleanText(
            formData.get("nama_lengkap"),
            100
          ),

        email:
          cleanEmail(
            formData.get("email")
          ),

        nik_ktp:
          cleanText(
            formData.get("nik_ktp"),
            30
          ),

        no_telepon:
          cleanPhone(
            formData.get("no_telepon")
          ),

        size_jersey:
          cleanText(
            formData.get("size_jersey"),
            10
          ),

        nama_bib:
          cleanText(
            formData.get("nama_bib"),
            30
          ),

        kategori:
          cleanText(
            formData.get("kategori"),
            50
          ),

        turnstile_token:
          turnstileToken
      };

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );

      const result =
        await response.json();

      if (
  !response.ok ||
  !result.success
) {
  let message =
    result.message ||
    "Pendaftaran gagal.";

  if (
    Array.isArray(result.error_codes) &&
    result.error_codes.length > 0
  ) {
    message +=
      " [" +
      result.error_codes.join(", ") +
      "]";
  }

  throw new Error(message);
}

      setStatus(
        "Pendaftaran berhasil. ID Peserta: " +
        result.id_peserta
      );

      form.reset();

      if (
        window.turnstile
      ) {
        turnstile.reset();
      }

    } catch (error) {

      console.error(error);

      setStatus(
        error.message ||
        "Terjadi kesalahan."
      );

      if (
        window.turnstile
      ) {
        turnstile.reset();
      }
    }
  }
);
