import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
  Divider,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";

const SearchResults = () => {
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState({});
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleSearch = async (value) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/projects/search?q=${value}`
          );
          setProjects(res.data.projects);
        } catch (err) {
          console.error("Search error:", err);
        }
      }, 400)
    );
  };

  const handleCommentChange = (projectId, value) => {
    setComments((prev) => ({ ...prev, [projectId]: value }));
  };

  const handleSubmitComment = async (projectId) => {
    const commentText = comments[projectId];
    if (!commentText) return;

    try {
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Comment submitted");
      setComments((prev) => ({ ...prev, [projectId]: "" }));
      fetchProjects();
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to submit comment");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🔍 Explore Projects
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title or creator name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </Paper>

      <Box display="flex" flexDirection="column" gap={4}>
        {projects.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              color: "#999",
              fontStyle: "italic",
              fontSize: "1rem",
            }}
          >
            🚫 No projects found.
          </Paper>
        ) : (
          projects.map((project) => (
            <Card
              key={project._id}
              elevation={4}
              sx={{
                borderRadius: 4,
                p: 2,
                backgroundColor: "#ffffff",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    {project.user?.name?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted by <strong>{project.user?.name || "Unknown"}</strong>
                  </Typography>
                </Stack>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {project.title}
                </Typography>

                <Typography variant="body1" gutterBottom color="text.primary">
                  {project.description}
                </Typography>

                {project.link && (
                  <MuiLink
                    href={
                      project.link.startsWith("http")
                        ? project.link
                        : `https://${project.link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    fontWeight="medium"
                    color="primary"
                  >
                    🔗 {project.link}
                  </MuiLink>
                )}

                {/* Show Comments */}
                {project.comments?.length > 0 && (
                  <>
                    <Typography mt={3} fontWeight="medium">
                      💬 Comments
                    </Typography>
                    <Box mt={1}>
                      {project.comments.map((c, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            pl: 1.5,
                            color: "text.secondary",
                            fontStyle: "italic",
                          }}
                        >
                          • {c.text}
                        </Typography>
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Add Comment Field */}
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  variant="outlined"
                  label="Add a comment"
                  placeholder="Write your thoughts..."
                  value={comments[project._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(project._id, e.target.value)
                  }
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleSubmitComment(project._id)}
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  Submit Comment
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default SearchResults;
