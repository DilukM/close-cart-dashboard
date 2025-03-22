import React, { useState } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Mail,
  Phone,
  Bookmark,
  Users,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";
import SaveButton from "../../components/settings/SaveButton";

const PreferenceSettings = () => {
  // Add initial state for contact form
  const [initialContactForm, setInitialContactForm] = useState({
    subject: "",
    message: "",
    supportType: "general",
  });

  const [loading, setLoading] = useState(false);
  const [contactForm, setContactForm] = useState({ ...initialContactForm });
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Track if there are changes in the form
  const [hasContactFormChanges, setHasContactFormChanges] = useState(false);

  // Check for changes when form data changes
  React.useEffect(() => {
    const formChanged =
      initialContactForm.subject !== contactForm.subject ||
      initialContactForm.message !== contactForm.message ||
      initialContactForm.supportType !== contactForm.supportType;

    setHasContactFormChanges(formChanged);
  }, [contactForm, initialContactForm]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Support request submitted successfully!");

      // Reset form and update initial state
      const newForm = {
        subject: "",
        message: "",
        supportType: "general",
      };

      setInitialContactForm(newForm);
      setContactForm(newForm);
    } catch (error) {
      toast.error("Failed to submit support request");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // FAQ data
  const faqCategories = [
    {
      id: "account",
      name: "Account & Security",
      faqs: [
        {
          id: 1,
          question: "How do I reset my password?",
          answer:
            "To reset your password, go to the login page and click 'Forgot Password'. Follow the instructions sent to your email to create a new password.",
        },
        {
          id: 2,
          question: "How can I change my email address?",
          answer:
            "You can update your email address in the Security section of your account settings. You'll need to verify the new email address before the changes take effect.",
        },
      ],
    },
    {
      id: "offers",
      name: "Offer Management",
      faqs: [
        {
          id: 3,
          question: "How do I create a new offer?",
          answer:
            "Navigate to the Offer Management section from the sidebar. Click the 'Create New Offer' button and fill out the required information in the form.",
        },
        {
          id: 4,
          question: "Can I schedule offers for future dates?",
          answer:
            "Yes, when creating or editing an offer, you can set start and end dates to schedule when your offer will be active.",
        },
      ],
    },
    {
      id: "billing",
      name: "Billing & Payments",
      faqs: [
        {
          id: 5,
          question: "How do I update my billing information?",
          answer:
            "Go to the Billing section in your account settings. Click 'Edit Payment Method' to update your credit card or other payment details.",
        },
        {
          id: 6,
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Help & Support
        </h2>
      </div>

      {/* FAQs & Guides */}
      <SettingsSection title="FAQs & Guides" icon={Bookmark}>
        <div className="space-y-6">
          {faqCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setSelectedFaq(selectedFaq === faq.id ? null : faq.id)
                      }
                      className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {faq.question}
                      </span>
                      <span className="text-yellow-500">
                        {selectedFaq === faq.id ? "−" : "+"}
                      </span>
                    </button>
                    {selectedFaq === faq.id && (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <a
              href="#"
              className="flex items-center text-yellow-500 hover:text-yellow-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                toast.info("This would link to the complete knowledge base");
              }}
            >
              View all guides and tutorials
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </SettingsSection>

      {/* Contact Support */}
      <SettingsSection title="Contact Support" icon={LifeBuoy}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <MessageSquare
              size={28}
              className="text-blue-500 dark:text-blue-400 mb-2"
            />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Live Chat
            </h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1 mb-3">
              Available Monday-Friday
              <br />
              9AM-5PM EST
            </p>
            <button
              className="mt-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              onClick={() => toast.info("Live chat would open here")}
            >
              Start Chat
            </button>
          </div>

          <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Mail
              size={28}
              className="text-purple-500 dark:text-purple-400 mb-2"
            />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Email Support
            </h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1 mb-3">
              Response within 24 hours
              <br />
              support@closecart.com
            </p>
            <button
              className="mt-auto px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              onClick={() => toast.info("Email link would open")}
            >
              Send Email
            </button>
          </div>

          <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <Phone
              size={28}
              className="text-green-500 dark:text-green-400 mb-2"
            />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Phone Support
            </h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1 mb-3">
              Premium customers only
              <br />
              1-800-555-0123
            </p>
            <button
              className="mt-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              onClick={() => toast.info("Phone call would be initiated")}
            >
              Call Support
            </button>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
            Submit a Support Ticket
          </h3>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Support Category
              </label>
              <select
                name="supportType"
                value={contactForm.supportType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Please describe your issue in detail"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <SaveButton
                onClick={null}
                loading={loading}
                text="Submit Ticket"
                disabled={
                  !hasContactFormChanges ||
                  !contactForm.subject.trim() ||
                  !contactForm.message.trim()
                }
              />
            </div>
          </form>
        </div>
      </SettingsSection>

      {/* Community Forum */}
      <SettingsSection title="Community & Resources" icon={Users}>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
              Community Forum
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect with other shop owners, share tips, and get advice from
              the community.
            </p>
            <div className="flex">
              <button
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center"
                onClick={() =>
                  toast.info("This would open the community forum")
                }
              >
                <Users className="mr-2 w-4 h-4" />
                Visit Forum
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                Video Tutorials
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Watch step-by-step guides on how to use all features.
              </p>
              <a
                href="#"
                className="text-yellow-500 hover:text-yellow-600 text-sm font-medium flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("This would open video tutorials");
                }}
              >
                View Tutorials
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                Documentation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Detailed guides and API documentation for developers.
              </p>
              <a
                href="#"
                className="text-yellow-500 hover:text-yellow-600 text-sm font-medium flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("This would open the documentation");
                }}
              >
                View Documentation
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default PreferenceSettings;
