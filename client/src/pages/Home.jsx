import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination,
} from "@mui/material";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
      setSelectedProject(res.data);
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment) return;
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${selectedProject._id}/comments`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComment("");
      handleView(selectedProject._id);
      alert("Comment added");
    } catch (err) {
      console.error("Comment submission failed:", err);
      alert("Failed to submit comment");
    }
  };

  // Pagination handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProjects = projects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        All Projects
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedProjects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleView(project._id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {paginatedProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={projects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Modal Dialog */}
      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedProject.title}
              </Typography>
              <Typography gutterBottom>
                {selectedProject.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Posted by:</strong>{" "}
                {selectedProject.user?.name || "Unknown"}
              </Typography>
              {typeof selectedProject.link === "string" &&
                selectedProject.link.trim().toLowerCase() !== "not available" &&
                selectedProject.link.trim() !== "" && (
                  <Typography mt={1}>
                    <a
                      href={
                        selectedProject.link.startsWith("http")
                          ? selectedProject.link
                          : `https://${selectedProject.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1976d2" }}
                    >
                      Visit Project
                    </a>
                  </Typography>
                )}

              <Typography variant="subtitle1" mt={2} mb={1} fontWeight="bold">
                💬 Comments
              </Typography>
              {selectedProject.comments?.length > 0 ? (
                selectedProject.comments.map((c) => (
                  <Typography
                    key={c._id}
                    variant="body2"
                    sx={{ fontStyle: "italic", mb: 1, pl: 1 }}
                  >
                    "{c.text}" — {new Date(c.createdAt).toLocaleString()}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No comments yet.
                </Typography>
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                label="Add a comment"
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProject(null)}>Close</Button>
          <Button variant="contained" onClick={handleSubmitComment}>
            Submit Comment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
