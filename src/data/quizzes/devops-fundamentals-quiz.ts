import type { Quiz } from "@/types";

export const devopsFundamentalsQuiz: Quiz = {
  id: "devops-fundamentals-quiz",
  title: "DevOps Fundamentals Quiz",
  lessonSlug: "devops-fundamentals",
  questions: [
    {
      id: "q1",
      question: "What is DevOps?",
      options: [
        "A specific tool or platform for deploying applications",
        "A culture and set of practices that bring development and operations together to deliver software faster and more reliably",
        "A replacement for all traditional IT operations",
        "A programming language for writing deployment scripts",
      ],
      correctIndex: 1,
      explanation:
        "DevOps is fundamentally a culture and a set of practices — not a single tool. It emphasizes collaboration between development and operations teams, automating processes, and sharing responsibility for the entire software delivery lifecycle. Tools support DevOps, but the mindset and culture come first.",
    },
    {
      id: "q2",
      question:
        "The CALMS framework is a maturity model for DevOps. What does each letter stand for?",
      options: [
        "Code, Automation, Lean, Measurement, Security",
        "Culture, Automation, Lean, Measurement, Sharing",
        "Continuous, Agile, Lean, Monitoring, Scalable",
        "Collaboration, Automation, Learning, Metrics, Speed",
      ],
      correctIndex: 1,
      explanation:
        "CALMS stands for: Culture (people working together, breaking silos), Automation (automating repetitive tasks), Lean (eliminating waste, small batches, fast feedback), Measurement (data-driven decisions, metrics over opinions), and Sharing (shared knowledge, open communication, shared responsibility). It is a framework for assessing DevOps maturity, not just a checklist.",
    },
    {
      id: "q3",
      question: "What is Continuous Integration (CI)?",
      options: [
        "Deploying code to production automatically on every commit",
        "Frequently merging developer code changes into a shared branch, with automated builds and tests providing fast feedback",
        "A tool that monitors production servers for errors",
        "The process of manually testing code before merging pull requests",
      ],
      correctIndex: 1,
      explanation:
        "Continuous Integration means developers merge their changes into a shared branch frequently (often multiple times per day). Each merge triggers an automated build and test cycle, giving the team fast feedback if something is broken. The goal is to catch integration problems early, when they are cheapest to fix.",
    },
    {
      id: "q4",
      question:
        "What is the difference between Continuous Delivery and Continuous Deployment?",
      options: [
        "They are the same thing — the terms are interchangeable",
        "Continuous Delivery means every commit goes straight to production; Continuous Deployment requires manual approval",
        "Continuous Delivery automates the pipeline up to staging, with a manual gate before production; Continuous Deployment automates the entire pipeline including the production release",
        "Continuous Delivery is for backend services; Continuous Deployment is for frontend applications",
      ],
      correctIndex: 2,
      explanation:
        "Continuous Delivery ensures that every change that passes the automated pipeline is in a release-ready state — but a human decides when to push to production. Continuous Deployment goes one step further: every change that passes all automated checks is deployed to production automatically, with no manual gate. Delivery = ready to deploy anytime; Deployment = deploy automatically every time.",
    },
    {
      id: "q5",
      question: "What are the key benefits of automation in DevOps?",
      options: [
        "Automation eliminates the need for developers entirely",
        "Automation reduces costs to zero and removes all bugs from code",
        "Automation provides consistency, speed, and reduced human error — the same process runs the same way every time",
        "Automation is only useful for deploying code, not for infrastructure or testing",
      ],
      correctIndex: 2,
      explanation:
        "Automation in DevOps delivers three core benefits: consistency (the same process runs identically every time, eliminating configuration drift), speed (machines execute tasks in seconds that take humans minutes or hours), and reduced human error (typos, missed steps, and forgotten configurations are eliminated). Automation applies to builds, tests, deployments, infrastructure provisioning, and monitoring — not just code deployment.",
    },
    {
      id: "q6",
      question:
        "How does DevOps differ from traditional operations (ops) teams?",
      options: [
        "DevOps teams use more servers; traditional ops teams use fewer",
        "Traditional ops works in silos with hand-offs between dev and ops; DevOps breaks down silos with shared responsibility, collaboration, and automated processes",
        "DevOps and traditional ops are identical — only the job titles are different",
        "Traditional ops uses the cloud; DevOps only uses on-premises servers",
      ],
      correctIndex: 1,
      explanation:
        "In traditional setups, developers throw code over the wall to ops teams, who then deal with deployment, monitoring, and incident response separately. This creates silos, slow feedback, and blame when things break. DevOps replaces this with shared responsibility: developers and operations collaborate from planning through production, use the same automated pipelines, and share on-call duties. The result is faster recovery, fewer outages, and better software.",
    },
    {
      id: "q7",
      question: "How do feedback loops work in DevOps?",
      options: [
        "Feedback loops are weekly meetings where managers review team performance",
        "Monitoring and observability data from production inform the next planning cycle, enabling short iterations and continuous improvement",
        "Feedback loops are automated emails sent to customers after each deployment",
        "Feedback loops only exist in Agile development and are not relevant to DevOps",
      ],
      correctIndex: 1,
      explanation:
        "In DevOps, feedback loops close the cycle: production monitoring (metrics, logs, traces, incidents) flows back into the planning phase. When an alert fires, an error rate spikes, or user behavior shifts, that data shapes what the team works on next. Short iterations mean you get feedback quickly and can adjust course before problems compound. This is why the DevOps lifecycle is a loop, not a straight line.",
    },
    {
      id: "q8",
      question:
        'Your team spends 2 hours per week on manual server configuration. Each time someone makes a typo, it causes an outage. What DevOps practice would help most?',
      options: [
        "Hire more operations staff to double-check configurations",
        "Switch to a different cloud provider that is more reliable",
        "Use Infrastructure as Code (IaC) and automation — define server configuration in version-controlled code that is applied automatically, eliminating manual typos and ensuring consistency",
        "Reduce the number of servers to minimize the chance of human error",
      ],
      correctIndex: 2,
      explanation:
        "Infrastructure as Code (IaC) solves both problems at once: the configuration is written in code (Terraform, Ansible, Pulumi, etc.), stored in version control, and applied automatically. No manual typing means no typos, and the same code produces the same result every time. This is the automation mindset in action — if you are doing something manually more than once, automate it.",
    },
  ],
};