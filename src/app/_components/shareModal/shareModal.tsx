
"use client";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Avatar, Divider, Card, CardContent
} from "@mui/material";
import { useState } from "react";
import { PostType } from "../../_interfaces/home";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    onShare: (body: string) => void;
    post: PostType;
}

export default function ShareModal({ open, onClose, onShare, post }: ShareModalProps) {
    const [body, setBody] = useState("");

    const handleShare = () => {
        onShare(body);
        setBody("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle fontWeight="bold">Share Post</DialogTitle>
            <DialogContent>
                {/* حقل النص اللي هيكتبه قبل الشير */}
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Say something about this post..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* البوست الأصلي */}
                <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "divider" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Avatar
                                src={post.user.photo}
                                sx={{ width: 36, height: 36 }}
                            >
                                {post.user.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography fontWeight="bold" fontSize={14}>
                                    {post.user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    @{post.user.name}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {post.body}
                        </Typography>

                        {post.image && (
                            <Box
                                component="img"
                                src={post.image}
                                alt="post"
                                sx={{ width: "100%", borderRadius: 2, maxHeight: 200, objectFit: "cover" }}
                            />
                        )}
                    </CardContent>
                </Card>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleShare} variant="contained">
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
}