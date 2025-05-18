import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: number;
  name: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image }) => {
  return (
    <Card
      component={Link}
      to={`/category/${name.toLowerCase()}`}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: 2,
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          boxShadow: 5,
          transform: "scale(1.03)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{ width: "100%", height: 180, objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" align="center">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
