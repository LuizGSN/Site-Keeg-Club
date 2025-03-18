import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const RichTextEditor = ({ initialValue, onEditorChange }) => {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey="6pi2gf7c0b8i6zlabisydobuzgycv1rf85m8q9031qec4omn" // KEY API TinyMCE
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
          'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount',
          'image', // Plugin de imagens
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help | image',
        images_upload_url: 'http://localhost:3001/upload', // Endpoint para upload de imagens
        images_upload_handler: (blobInfo, progress) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            fetch('http://localhost:3001/upload', {
              method: 'POST',
              body: formData,
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Erro no upload');
                }
                return response.json();
              })
              .then(data => resolve(data.location)) // Retorna a URL da imagem
              .catch(error => reject(error.message)); // Retorna uma mensagem de erro
          });
        },
      }}
      onEditorChange={onEditorChange}
    />
  );
};