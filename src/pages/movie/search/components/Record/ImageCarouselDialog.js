import { CardMedia, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import React from "react";

function Item({ item }) {
  return (
    <CardMedia
      component="img"
      image={item.url}
      sx={{
        maxHeight: "77vh",
        width: "100%",
        objectFit: "contain"
      }}
    />
  );
}

const ImageCarouselDialog = ({ open, onClose, images, title }) => {
  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent style={{ padding: "0px" }}>
        <Carousel autoPlay={false} navButtonsAlwaysVisible>
          {
            images && images.map((item, i) => <Item key={i} item={item} />)
          }
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
export default ImageCarouselDialog;