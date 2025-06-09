namespace BackendSessionAPISchemas {
  export type SessionTypeSchema = {
    id: string;
    event: string;
    name: string;
  };

  export type SessionCategorySchema = {
    id: string;
    presentationType: string;
    name: string;
  };

  export type SessionSpeakerSchema = {
    id: string;
    presentation: string;
    user: string;
    name: string;
    biography: string;
    image: string; // DB 반영 필요
  };

  export type SessionSchema = {
    id: string;
    name: string; // DB 반영 필요
    doNotRecord: boolean; // DB 반영 필요
    presentationType: SessionTypeSchema;
    presentationCategories: SessionCategorySchema[];
    presentationSpeaker: SessionSpeakerSchema[];
  };
}

export default BackendSessionAPISchemas;
