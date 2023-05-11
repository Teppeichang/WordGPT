import Swal from "sweetalert2";
import { Button } from "@mui/material";

const CopyButton = ({ draftArticle }) => {
  const copyToClipboard = async (event) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(draftArticle);
      Swal.fire({
        icon: "success",
        title: "コピーしました",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "コピーに失敗しました",
      });
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      variant="contained"
      disableElevation={true}
      className="text-white py-2 mb-10 rounded-lg w-36"
      sx={{ backgroundColor: "#60A5FA", fontWeight: "bold", ml: 3 }}
    >
      コピー
    </Button>
  );
};

export default CopyButton;
