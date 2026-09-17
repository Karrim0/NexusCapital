import apiClient from "../utils/apiClient";

// Uploads a single image immediately and returns its public URL.
// Used by dashboard CMS list editors (e.g. Destinations cards) where
// items can be added/removed freely, so each image is stored on its own
// instead of being bundled into the page's main save request.
//
// `folder` must match one of the backend's allowed folders, e.g.
// "home-destinations" or "about-destinations".
export const uploadContentImage = async (file, folder) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  const { data } = await apiClient.post("/content-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { message, path, url }
};
