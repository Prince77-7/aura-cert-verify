import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          Shield of Steel - Training Division ("us", "we", or "our") operates the 
          certificate verification platform (the "Service"). This page informs you of 
          our policies regarding the collection, use, and disclosure of personal 
          data when you use our Service and the choices you have associated with 
          that data.
        </p>

        <h2>Information Collection and Use</h2>
        <p>
          We collect minimal information necessary to provide and improve the Service. 
          The primary purpose of this platform is to verify the authenticity of 
          certificates issued by Shield of Steel - Training Division. 
        </p>
        <ul>
          <li><strong>Verification Data:</strong> When verifying a certificate, you may provide a certification ID. We use this ID solely to retrieve and display the corresponding certificate details. We do not store the IDs you enter for verification purposes after the verification process is complete.</li>
          <li><strong>Certificate Data:</strong> The certificate data itself (recipient name, course title, issue date, etc.) is stored securely in our database as part of our operational records. Access to this data is strictly controlled.</li>
          <li><strong>Usage Data (Optional):</strong> We may collect anonymous usage data to monitor and improve the Service performance and user experience. This data does not include personally identifiable information.</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          The security of your data is paramount. We implement robust security measures, 
          including encryption and access controls, to protect the information stored 
          in our systems. Our infrastructure is designed to prevent unauthorized access, 
          disclosure, alteration, or destruction of data.
        </p>

        <h2>Data Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable 
          information to outside parties. Certificate data is only displayed upon successful 
          verification using a valid certification ID. We may disclose information if 
          required by law or to protect our rights, property, or safety, or that of others.
        </p>

        <h2>Your Rights</h2>
        <p>
          As the purpose of this platform is primarily verification based on issued certificates, 
          the concept of user accounts and extensive personal data collection does not apply 
          in the same way as other services. If you are a certificate holder and have concerns 
          about your data, please contact us using the information below.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any 
          changes by posting the new Privacy Policy on this page. You are advised to 
          review this Privacy Policy periodically for any changes.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through 
          our official contact channels.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
