import assert from "node:assert/strict";
import { test } from "node:test";
import { rehypeDsTaskLists } from "../src/markdown/tasks.js";

const text = (value) => ({ type: "text", value });
const element = (tagName, properties, children = []) => ({
  type: "element",
  tagName,
  properties,
  children
});
const root = (...children) => ({ type: "root", children });
const checkbox = (checked) =>
  element("input", { type: "checkbox", checked, disabled: true });
const item = (...children) =>
  element("li", { className: ["task-list-item"] }, children);

test("a task's checkbox and its text go in a label, so the text names the checkbox", () => {
  const tree = root(
    element("ul", { className: ["contains-task-list"] }, [
      item(checkbox(true), text(" Done "), element("code", {}, [text("x")]))
    ])
  );
  rehypeDsTaskLists()(tree);
  const [label] = tree.children[0].children[0].children;
  assert.equal(label.tagName, "label");
  assert.deepEqual(
    label.children.map((node) => node.tagName ?? node.value),
    ["input", " Done ", "code"]
  );
});

test("a nested list stays outside the label", () => {
  const tree = root(
    item(
      checkbox(false),
      text(" Parent"),
      element("ul", {}, [element("li", {}, [text("child")])])
    )
  );
  rehypeDsTaskLists()(tree);
  const [label, list] = tree.children[0].children;
  assert.equal(label.tagName, "label");
  assert.equal(label.children.length, 2);
  assert.equal(list.tagName, "ul");
});

test("in a loose list the label goes inside the paragraph", () => {
  const tree = root(item(element("p", {}, [checkbox(false), text(" Loose")])));
  rehypeDsTaskLists()(tree);
  const [paragraph] = tree.children[0].children;
  assert.equal(paragraph.tagName, "p");
  assert.equal(paragraph.children[0].tagName, "label");
});

test("a checkbox that is not the first thing in its item is left alone", () => {
  const tree = root(element("li", {}, [text("Text "), checkbox(false)]));
  rehypeDsTaskLists()(tree);
  assert.equal(tree.children[0].children[1].tagName, "input");
});
