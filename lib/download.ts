export const handleDownload = async (
  fileUrl: string,
  filename: string,
  extOverride?: string
): Promise<void> => {
  try {
    // Fetch the resource
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download file: ${response.status} ${response.statusText}`
      );
    }

    // Convert the response to a blob
    const blob = await response.blob();

    // Create an object URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Infer extension
    const contentType = response.headers.get("content-type") || "";
    const inferExt = () => {
      if (extOverride) return extOverride.replace(/^\./, "");
      if (contentType.includes("video/"))
        return contentType.split("/")[1] || "mp4";
      if (contentType.includes("image/"))
        return contentType.split("/")[1] || "png";
      if (contentType.includes("application/pdf")) return "pdf";
      return "bin";
    };
    const safeName = filename.replace(/[^a-z0-9-_]/gi, "_");
    const ext = inferExt();

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;

    // Set the download attribute with filename
    link.setAttribute("download", `${safeName}.${ext}`);

    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
