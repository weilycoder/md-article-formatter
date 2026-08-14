# 欢迎使用 Markdown 格式化工具
这是一个**示例**文本。


请在此输入您的 Markdown 内容，或点击下方**上传**按钮导入 .md 文件。


## 基础功能

规范化不影响渲染的 markdown 格式问题。

## 可选选项

您可以选择性地启用或禁用以下功能，并在右侧预览中查看效果。

### 中英文空格（包含数字）

你好World

### 中文与行内公式空格

质能方程$E=mc^2$

### 中文与行内代码空格

Python 交换语句`a, b = b, a`

### 中文标点空格去除

你好， 世界

其实是考虑到这种情况：你好, world

### 粗体/斜体空格去除

&#x5728;**&#x20;粗体&#x20;**&#x548C;*&#x20;斜体&#x20;*&#x6587;本前后自动移出多余空格

这真的有需求吗？我打赌 0 人在看到这行 markdown 前知道如何在**粗体**和*斜体*前后加空格。

### 多个空格合并

Hello   World

同类的空格字符将被合并为一个空格。

### 转义格式化控制符

防止代码中设计的格式化控制符被格式化器误处理。

例如：Hello&#x200d;World.

### 英文标点替换

你好,世界

### Latex 符号替换

将部分代码化的公式替换为正规的命令：

+ $*$ 将被替换为 `\times`，如果确实需要使用星号，请使用 $\ast$；
+ $<=$、$>=$ 和 $!=$ 将被替换为 `\leq`、`\geq` 和 `\neq`；
+ $->$ 将被替换为 `\to`；$<-$ 将被替换为 `\gets`；
+ $==$ 将被替换为 `=`。

可以在设置中添加更多替换规则，但设计上规定被替换项不得包含字母或数字，替换项必须为 `\` 开头的命令或单个符号（非字母非数字）。

### 代码格式化（默认不开启）

由 clang-format 提供 C/C++/Java/JavaScript/TypeScript 等语言的代码格式化功能。

```cpp
#include<iostream>
using namespace std;
int main() {
  int a,b;
  cin>>a>>b;
  cout << a+b << endl;
return 0;
}
```

由 remark 提供 Markdown 代码块的格式化功能。

```markdown
# 这是一个标题
paragraph with some text.
```

由 Ruff 提供 Python 代码块的格式化功能。

```python
a,b=1,2
def add(x,y):
  return x+y
result=add(a,b)
print(result)
```