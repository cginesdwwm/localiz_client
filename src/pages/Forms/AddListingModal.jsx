import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadImage } from "../../lib/uploadService";
import { useBlog } from "../../context/BlogContext";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";

const schema = yup.object({
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
    handleSubmit,
    setValue,
    reset,
    control,
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
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl shadow-2xl modal-card">
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Nouvel article
                </h2>
                <p className="text-sm text-gray-500">
                  Partagez votre contenu avec la communauté
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-8 h-8 rounded-full"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
            <FocusRing>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre de l'article
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Donnez un titre accrocheur à votre article..."
                        className={`w-full border-2 rounded-xl p-4 focus:outline-none focus:ring-4 transition-all input-surface ${
                          errors.title
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                        error={errors.title?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contenu
                  </label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <textarea
                          placeholder="Rédigez votre article ici..."
                          rows="6"
                          {...field}
                          className={`w-full border-2 rounded-xl p-4 focus:outline-none focus:ring-4 transition-all resize-none input-surface placeholder:text-[15px] ${
                            errors.content
                              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />
                        {errors.content && (
                          <p className="error-text text-sm mt-1">
                            {errors.content.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
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
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-input").click()
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
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                              ✓
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {preview ? "Image sélectionnée" : ""}
                              </p>
                              <p className="text-sm text-gray-500">{}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-8 h-8 rounded-full text-red-600"
                            onClick={removeImage}
                            type="button"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.image && (
                    <p className="error-text text-sm mt-1">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
            </FocusRing>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                className="px-6 py-3 rounded-xl"
                onClick={cancelForm}
                type="button"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                Publier l'article
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
