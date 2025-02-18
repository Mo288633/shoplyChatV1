import * as React from "react"
import { Send, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export function FeedbackDialog() {
  const [open, setOpen] = React.useState(false)
  const [feedback, setFeedback] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle feedback submission
    console.log("Feedback submitted:", feedback)
    setFeedback("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>
            Ideas on how to improve this page. Use the Support Form for technical issues.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Your feedback..."
            />
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" className="h-8 w-8">
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Attach screenshot</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                Attach screenshots by clicking or pasting
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              Have a technical issue? Contact{" "}
              <a href="#" className="text-primary hover:underline">
                support
              </a>{" "}
              or{" "}
              <a href="#" className="text-primary hover:underline">
                browse our docs
              </a>
              .
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Send feedback
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}