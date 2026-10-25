# Guidelines

A guideline is one rule for using the system. Written well, a person can follow it, an agent can apply it and a tool can check it.

## One rule, one statement

Each guideline is a single sentence with a requirement level:

| Level | Meaning |
| --- | --- |
| must | Required. Breaking it is a bug |
| should | Expected, unless there is a reason not to |
| may | Allowed and optional |
| should not | Avoid, unless there is a reason |
| must not | Never |

These levels work like the keywords in standards documents. Use them on purpose: a rule marked "must" that nobody checks will be broken.

Group guidelines under **when to use** (whether this is the right thing at all) or **how to use** (doing it right once chosen).

## Say why, and how it is checked

- **Evidence** names the outside source the rule follows, such as a WCAG success criterion. A rule with a reason is easier to apply to cases the rule did not foresee.
- **Checked by** says whether a rule is checked automatically, with help from a tool, or by hand. For an automatic check, name it: a test, a lint rule, or a contrast check that runs on every build.

## Write shared rules once

Rules that apply to many components, such as "every interactive element has a visible focus indicator", live in one place. Component pages link to them instead of repeating them.

## Example

> **How to use**
>
> - **Must:** Label the button with the action it performs, such as "Save draft". Checked by: manual review.
> - **Should:** Keep one primary button per screen.
> - **Must not:** Build a button from a `div` with a click handler. Evidence: WCAG 2.2 SC 4.1.2 Name, Role, Value.

## Source

[DSDS guidelines sections](https://designsystemdocspec.org/), which define the requirement levels, the when-to-use and how-to-use framing, evidence and checks.
