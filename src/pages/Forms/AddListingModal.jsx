import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadImage } from "../../lib/uploadService";
import { useBlog } from "../../context/BlogContext";

const schema = yup.object().shape({
  title: yup.string().required("Le titre est obligatoire"),
  content: yup.string().required("Le contenu est obligatoire"),
  image: yup
    .mixed()
    .nullable()
    .test(
      "fileSize",
      "La taille du fichier doit être inférieure à 5MB",
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Format accepté : PNG, JPG, JPEG",
      (value) =>
        !value ||
        (value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type))
    ),
});

export default function AddBlogModal({ isOpen, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const { addBlog } = useBlog();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let imageUrl = null;
    if (data.image) {
      imageUrl = await uploadImage(data.image);
    }

    await addBlog({
      title: data.title,
      content: data.content,
      image: imageUrl,
    });

    reset();
    setPreview(null);
    setLoading(false);
    onClose();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file) {
        setValue("image", file, { shouldValidate: true });
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const removeImage = () => {
    setValue("image", null, { shouldValidate: true });
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const cancelForm = () => {
    setPreview(null);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-auto">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
        style={{ zIndex: -1 }}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-3xl shadow-2xl"
          style={{ backgroundColor: "#ffffff", opacity: 1, zIndex: 1 }}
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="w-8 h-8" aria-hidden="true"></div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Nouvel article
                </h2>
                <p className="text-sm text-gray-500">
                  Partagez votre contenu avec la communauté
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de l'article
                </label>
                <input
                  type="text"
                  placeholder="Donnez un titre accrocheur à votre article..."
                  {...register("title")}
                  className={`w-full border-2 rounded-xl p-4 focus:outline-none focus:ring-4 transition-all ${
                    errors.title
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  style={{ backgroundColor: "#ffffff", opacity: 1 }}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contenu
                </label>
                <textarea
                  placeholder="Rédigez votre article ici..."
                  rows="6"
                  {...register("content")}
                  className={`w-full border-2 rounded-xl p-4 focus:outline-none focus:ring-4 transition-all resize-none ${
                    errors.content
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  style={{ backgroundColor: "#ffffff", opacity: 1 }}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image
                </label>

                {!preview ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                    style={{ opacity: 1 }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input}").click()
                    }
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Glissez votre image ici
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ou cliquez pour parcourir vos fichiers
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <span>PNG, JPG, JPEG jusqu'à 5MB</span>
                      </div>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div
                    className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
                    style={{ opacity: 1 }}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                            ✓
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {preview ? "Image sélectionnée" : ""}
                            </p>
                            <p className="text-sm text-gray-500"></p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={cancelForm}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all hover:scale-105"
                style={{ opacity: 1 }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl text-white font-semibold hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                Publier l'article
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
