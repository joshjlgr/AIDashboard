import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, StickyNote, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const NOTE_COLORS = {
  yellow: 'bg-amber-50 border-amber-200',
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-emerald-50 border-emerald-200',
  pink: 'bg-rose-50 border-rose-200',
  purple: 'bg-violet-50 border-violet-200',
};

const COLOR_DOTS = {
  yellow: 'bg-amber-400',
  blue: 'bg-blue-400',
  green: 'bg-emerald-400',
  pink: 'bg-rose-400',
  purple: 'bg-violet-400',
};

export default function NotesWidget() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => base44.entities.Note.list('-created_date', 20),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Note.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setTitle(""); setContent(""); setColor("yellow"); setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Note.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({ title, content, color });
  };

  return (
    <Card className="h-full border-0 shadow-lg flex flex-col overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Notes</h2>
          <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
            {notes.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowForm(!showForm)}
          className="h-8 w-8 rounded-lg"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreate}
              className="space-y-3 pb-3 border-b border-border/50"
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="bg-secondary/50 border-0"
              />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something..."
                className="bg-secondary/50 border-0 h-20 resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.keys(COLOR_DOTS).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-5 h-5 rounded-full ${COLOR_DOTS[c]} transition-all ${
                        color === c ? 'ring-2 ring-offset-2 ring-primary/40 scale-110' : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <Button type="submit" size="sm" className="rounded-lg bg-primary">
                  Add Note
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && notes.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <StickyNote className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No notes yet</p>
            <p className="text-xs text-muted-foreground/60">Click + to create one</p>
          </div>
        )}

        <AnimatePresence>
          {notes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-xl p-4 border ${NOTE_COLORS[note.color] || NOTE_COLORS.yellow} group relative`}
            >
              <h4 className="text-sm font-semibold text-foreground">{note.title}</h4>
              {note.content && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{note.content}</p>
              )}
              <button
                onClick={() => deleteMutation.mutate(note.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}