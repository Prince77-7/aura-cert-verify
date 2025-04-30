
export interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  styles: {
    backgroundColor: string;
    backgroundImage?: string;
    borderStyle: string;
    borderColor: string;
    borderWidth: string;
    width: string;
    height: string;
    fontFamily: string;
    titleStyles: {
      fontSize: string;
      fontWeight: string;
      color: string;
      textAlign: string;
      marginTop: string;
      marginBottom: string;
    };
    recipientStyles: {
      fontSize: string;
      fontWeight: string;
      color: string;
      textAlign: string;
      marginTop: string;
      marginBottom: string;
    };
    issuerStyles: {
      fontSize: string;
      fontWeight: string;
      color: string;
      textAlign: string;
      marginTop: string;
      marginBottom: string;
    };
    dateStyles: {
      fontSize: string;
      fontWeight: string;
      color: string;
      textAlign: string;
      marginTop: string;
      marginBottom: string;
    };
    descriptionStyles: {
      fontSize: string;
      fontWeight: string;
      color: string;
      textAlign: string;
      marginTop: string;
      marginBottom: string;
    };
    logoStyles: {
      width: string;
      height: string;
      position: "top" | "bottom" | "left" | "right";
      margin: string;
    };
    signatureStyles: {
      width: string;
      height: string;
      position: "bottom";
      margin: string;
    };
  };
}
