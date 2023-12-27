// types.ts
export type Ids = {
  id: number
}

  export type User = {
    id: number;
    email: string;
    username: string;
    password: string;
    reports: Report[];
    templates: Templates[];
    comments: Comment[];
  };
  
  export type Report = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    isPosted: boolean;
  };

  export type Reports = {
    reportInfos: Report[]
  }
  
  export type Templates = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    author: User[];
  };
  
  export type Comment = {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    author: User;
    reportId: number;
    report: Report;
  };

//　基本の型を取るにはこれ
  export type ReportWithAuthor = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    isPosted: boolean;
    author: {
      id: number;
      email: string;
      username: string;
    };
  };
  // テンプレートの基本の形
  export type TemplatesWithAuthor = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    author: {
      id: number;
      email: string;
      username: string;
    };
  };

  var black   = '\u001b[30m';
  var red     = '\u001b[31m';
  var green   = '\u001b[32m';
  var yellow  = '\u001b[33m';
  var blue    = '\u001b[34m';
  var magenta = '\u001b[35m';
  var cyan    = '\u001b[36m';
  var white   = '\u001b[37m';
  
  var reset   = '\u001b[0m';