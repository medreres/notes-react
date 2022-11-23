import React, { useMemo, useState } from "react";
import styles from "./NoteList.module.css";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { RawNote, Tag } from "./models/tag";

interface NoteListProps {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  updateTag: (id: string, label: string) => void;
  deleteTag: (id: string) => void;
}

const NoteList = ({
  availableTags,
  notes,
  updateTag,
  deleteTag,
}: NoteListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  //   const filteredNotes = availableNotes.filter((note) =>
  //     note.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
  //   );

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title.length === 0 ||
          note.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())) &&
        (selectedTags.length === 0 ||
          note.tags.every((tag) =>
            selectedTags.some((selectedTag) => selectedTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  const toggleModalHandler = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button variant="outline-secondary" onClick={toggleModalHandler}>
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <FormGroup controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                options={availableTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return {
                        label: tag.label,
                        id: tag.value,
                      };
                    })
                  );
                }}
                isMulti
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => {
          return (
            <Col key={note.id}>
              <NoteCard id={note.id} tags={note.tags} title={note.title} />
            </Col>
          );
        })}
      </Row>
      <EditTagsModal
        updateTag={updateTag}
        deleteTag={deleteTag}
        show={showModal}
        tags={availableTags}
        toggleModal={toggleModalHandler}
      />
    </>
  );
};

interface EditTagsModal {
  tags: Tag[];
  show: boolean;
  toggleModal: () => void;
  updateTag: (id: string, label: string) => void;
  deleteTag: (id: string) => void;
}

const EditTagsModal = ({
  tags,
  show,
  toggleModal,
  deleteTag,
  updateTag,
}: EditTagsModal) => {
  return (
    <Modal show={show} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {tags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => {
                      updateTag(tag.id, e.target.value);
                    }}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={deleteTag.bind(null, tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

interface SimplifiedNote {
  tags: Tag[];
  title: string;
  id: string;
}

const NoteCard = ({ tags, title, id }: SimplifiedNote) => {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id} bg="primary">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default NoteList;
