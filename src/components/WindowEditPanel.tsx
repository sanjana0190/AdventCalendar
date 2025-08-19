import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import React, { useState, useEffect } from "react";
import { WindowContent } from "../types/calendar";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CALENDAR_TITLE } from "../graphql/mutations/calendar";
import { getCurrentCalendarId } from "../utils/sessionUtils";
import { GET_CALENDAR_DETAILS } from "../graphql/queries/calendar";

interface WindowEditPanelProps {
  day: number;
  content?: WindowContent;
  onSave: (content: WindowContent) => void;
  onClose: () => void;
}

const uploadToS3 = async (file: File) => {
  const s3 = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: "AKIAW2HDBLBZV44OOW4M",
      secretAccessKey: "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",
    },
  });

  const key = `adventCalendarImagesUploaded/${file.name}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: "sanjanaprojectbucket",
      Key: key,
      Body: file,
      ContentType: file.type,
      // ACL removed - bucket doesn't allow ACLs
    },
  });

  await upload.done();
  return `https://sanjanaprojectbucket.s3.eu-north-1.amazonaws.com/${key}`;
};

const WindowEditPanel = ({
  day,
  content,
  onSave,
  onClose,
}: WindowEditPanelProps) => {
  const [formData, setFormData] = useState<Omit<WindowContent, "day">>({
    title: "",
    description: "",
    link: "",
    imageUrl: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [calendarTitle, setCalendarTitle] = useState("");
  const [updateCalendarTitle, { loading: updatingTitle }] = useMutation(
    UPDATE_CALENDAR_TITLE
  );

  const calendarId = getCurrentCalendarId();
  const { data: calendarData, refetch } = useQuery(GET_CALENDAR_DETAILS, {
    variables: { id: calendarId },
    skip: !calendarId,
  });

  // Start with title mode until a title exists
  const hasTitle = Boolean(calendarData?.calendars?.[0]?.title);
  const [titleSaved, setTitleSaved] = useState<boolean>(hasTitle);

  useEffect(() => {
    if (content) {
      setFormData(content);
    } else {
      setFormData({
        title: "",
        description: "",
        link: "",
        imageUrl: "",
        imageFile: null,
      });
    }
  }, [day, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleSaved) return; // cannot save window until title saved
    setLoading(true);
    let imageUrl = formData.imageUrl;

    if (formData.imageFile) {
      try {
        imageUrl = await uploadToS3(formData.imageFile);
      } catch (err) {
        if (err instanceof Error) {
          alert("Upload failed: " + err.message);
        } else {
          alert("Upload failed: " + String(err));
        }
        setLoading(false);
        return;
      }
    }

    onSave({ ...formData, day, imageUrl });
    setLoading(false);
  };

  const handleUpdateTitle = async () => {
    if (!calendarId || !calendarTitle.trim()) return;
    try {
      await updateCalendarTitle({
        variables: { id: calendarId, title: calendarTitle.trim() },
      });
      await refetch();
      setTitleSaved(true);
    } catch (e) {
      // ignore for now
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-subheader text-[#E73B0D]">
          {titleSaved ? `Editing Window ${day}` : "Name your calendar first"}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        ></button>
      </div>

      {!titleSaved && (
        <div className="mb-6">
          <label
            htmlFor="calendarTitle"
            className="block text-sm font-body text-[#E73B0D] mb-2"
          >
            Calendar Title
          </label>
          <input
            id="calendarTitle"
            type="text"
            value={calendarTitle}
            onChange={(e) => setCalendarTitle(e.target.value)}
            placeholder="Enter calendar title"
            className="w-full p-2 border rounded font-body mb-3"
          />
          <button
            type="button"
            onClick={handleUpdateTitle}
            disabled={updatingTitle || !calendarTitle.trim()}
            className="w-full bg-[#E73B0D] text-white py-2 rounded disabled:opacity-60"
          >
            {updatingTitle ? "Saving..." : "Save Title"}
          </button>
        </div>
      )}

      {titleSaved && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full p-2 border rounded font-body"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded font-body"
          />

          <input
            type="url"
            placeholder="Link (Optional)"
            value={formData.link || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, link: e.target.value }))
            }
            className="w-full p-2 border rounded font-body"
          />

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imageFile: e.target.files?.[0] || null,
                  imageUrl: e.target.files?.[0]
                    ? URL.createObjectURL(e.target.files[0])
                    : prev.imageUrl,
                }))
              }
              className="w-full p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E73B0D] text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : `Save Window ${day}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default WindowEditPanel;
