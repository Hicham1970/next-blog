import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  const { theme } = useTheme();

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/dashboard/create-post');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Veuillez sélectionner une image");
        return null;
      }
      
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(progress.toFixed(0));
          },
          (error) => {
            console.error("Erreur d'upload:", error);
            setImageUploadError("Échec du téléchargement de l'image");
            setImageUploadProgress(null);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setImageUploadProgress(null);
              setImageUploadError(null);
              setFormData(prev => ({ ...prev, image: downloadURL }));
              resolve(downloadURL);
            } catch (error) {
              console.error("Erreur lors de la récupération de l'URL:", error);
              setImageUploadError("Erreur lors du traitement de l'image");
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Erreur inattendue:", error);
      setImageUploadError("Une erreur inattendue s'est produite");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      setPublishError("Veuvez-vous connecter pour publier un article");
      return;
    }

    try {
      setIsSubmitting(true);
      setPublishError(null);

      // Télécharger l'image d'abord si nécessaire
      if (file) {
        await handleUpdloadImage();
      }

      // Vérifier que les champs requis sont remplis
      if (!formData.title || !formData.content) {
        setPublishError("Le titre et le contenu sont obligatoires");
        return;
      }

      // Récupérer le jeton d'authentification
      console.log("Récupération du jeton d'authentification...");
      const token = sessionStorage.getItem("token");

      console.log("Jeton récupéré:", token ? `[JETON PRÉSENT, ${token.length} caractères]` : "[JETON MANQUANT]");
      
      if (!token) {
        throw new Error("Impossible de récupérer le jeton d'authentification. Veuillez rafraîchir la page et réessayer.");
      }

      // Préparer les données à envoyer
      const postData = {
        ...formData,
        userMongoId: user?.publicMetadata?.userMongoId,
      };
      
      console.log("Données à envoyer:", { 
        hasTitle: !!formData.title,
        hasContent: !!formData.content,
        hasImage: !!formData.image,
        hasUserMongoId: !!postData.userMongoId,
        tokenLength: token?.length || 0
      });

      // Envoyer les données au serveur
      console.log("Envoi de la requête à /api/post/create...");
      const response = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          Accept:'application/json',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });

      console.log("Réponse reçue - Statut:", response.status);
      
      // Vérifier si la réponse est du JSON valide
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
          console.log("Réponse JSON:", data);
        } catch (jsonError) {
          console.log("Erreur d'analyse JSON:", jsonError);
          throw new Error("Réponse invalide du serveur. Veuillez réessayer.");
        }
      } else {
        const textResponse = await response.text();
        console.log("Réponse non-JSON reçue:", textResponse);
        
        if (response.status === 401) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        } else if (response.status === 403) {
          throw new Error("Accès refusé. Vous n'avez pas les permissions nécessaires.");
        } else {
          throw new Error("Format de réponse inattendu du serveur.");
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      // Rediriger vers le post créé
      if (data.slug) {
        console.log("Redirection vers le post créé:", `/post/${data.slug}`);
        router.push(`/post/${data.slug}`);
      } else {
        throw new Error("Slug non reçu du serveur");
      }
    } catch (error) {
      console.log("Erreur lors de la publication:", error);
      setPublishError(error.message || "Une erreur est survenue lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un indicateur de chargement pendant le chargement de l'état d'authentification
  if (!isLoaded) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  // Le reste du composant reste inchangé
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Créer un article</h1>
      
      {publishError && (
        <Alert color="failure" className="mb-4">
          {publishError}
        </Alert>
      )}
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Titre"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            id="category"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="uncategorized">Sélectionner une catégorie</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={!file || imageUploadProgress !== null}
          >
            {imageUploadProgress ? (
              <div className="w-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              'Télécharger une image'
            )}
          </Button>
        </div>
        
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        
        <div className={theme === 'dark' ? 'dark' : ''}>
          <ReactQuill
            theme="snow"
            placeholder="Écrivez quelque chose d'incroyable..."
            className="h-80 mb-12"
            required
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
        </div>
        
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publication en cours...' : 'Publier'}
        </Button>
      </form>
    </div>
  );
}
