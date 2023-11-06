import { Box, CardMedia, CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import React, { useState } from "react";

function Item({ item }) {
  const [loading, setLoading] = useState(true);
  return (
    <Box>
      <CardMedia
        component="img"
        image={item.url}
        sx={{
          maxHeight: "77vh",
          width: "100%",
          objectFit: "contain"
        }}
        onLoad={() => setLoading(false)}
      />

      {loading && (<Box sx={{ position: "relative", width: "100%", minHeight: "40vh" }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      )}

    </Box>
  );
}

const ImageCarouselDialog = ({ open, onClose, images, title }) => {
  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent style={{ padding: "0px" }}>
        <Carousel autoPlay={false} navButtonsAlwaysVisible animation={"slide"}>
          {
            images && images.map((item, i) => <Item key={i} item={item} />)
          }
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
export default ImageCarouselDialog;