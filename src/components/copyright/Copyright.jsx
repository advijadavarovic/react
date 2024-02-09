import Typography from "@mui/material/Typography";
import {Link} from "@mui/material";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.bing.com/ck/a?!&&p=6395dc94e6f83fe6JmltdHM9MTcwNjkxODQwMCZpZ3VpZD0xNmIxZmUxYy0zYTQ3LTZjMzAtMmFmZC1lZGExM2IwMzZkYWMmaW5zaWQ9NTIwOA&ptn=3&ver=2&hsh=3&fclid=16b1fe1c-3a47-6c30-2afd-eda13b036dac&psq=serapion&u=a1aHR0cHM6Ly9zZXJhcGlvbi5uZXQv&ntb=1">
                Serapion
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;