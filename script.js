document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('.tag-input');
  const result = document.getElementById('result');
  const underlineCheckbox = document.getElementById('remove-underscore');

  // Load input values from localStorage and combine tags
  loadAndCombine();

  // Event listener for input changes
  inputs.forEach(input => {
      input.addEventListener('input', function() {
          // Save current input values to localStorage
          saveInputs();
          // Combine tags
          combineTags();
      });
  });

  // Event listener for checkbox changes
  underlineCheckbox.addEventListener('change', combineTags);

  function loadAndCombine() {
      inputs.forEach((input, index) => {
          // Load values from localStorage using index as part of key
          input.value = localStorage.getItem(`tag-input-${index}`) || '';
      });
      combineTags();
  }

  function saveInputs() {
      inputs.forEach((input, index) => {
          // Save each input value to localStorage using index as part of key
          localStorage.setItem(`tag-input-${index}`, input.value);
      });
  }

  function combineTags() {
      let tags = [];
      inputs.forEach(input => {
          // Process each input value
          input.value.split(',').forEach(tag => {
              const trimmedTag = tag.trim();
              if (trimmedTag) {
                  tags.push(trimmedTag);
              }
          });
      });

      // Display combined tags
      let combinedResult = tags.join(', ');
      if (underlineCheckbox.checked) {
          combinedResult = combinedResult.replace(/_/g, ' '); // 언더바를 공백으로 대체
      }
      result.value = combinedResult;
  }

  // 파일 가져오기 기능
  document.getElementById('importButton').addEventListener('change', function(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
          const contents = event.target.result;
          // 가정: 파일의 내용은 JSON 형식입니다.
          const data = JSON.parse(contents);
          for (const key in data) {
              if (data.hasOwnProperty(key)) {
                  const input = document.getElementById(key);
                  if (input) {
                      input.value = data[key];
                  }
              }
          }
          combineTags(); // 입력 필드 업데이트 후 태그 조합
      };
      fileReader.readAsText(event.target.files[0]);
  });

  // 파일 내보내기 기능
  document.getElementById('exportButton').addEventListener('click', function() {
      const data = {};
      inputs.forEach(input => {
          data[input.id] = input.value;
      });
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tags.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });
});

// 클릭 이벤트 리스너를 복사 버튼에 추가합니다.
document.getElementById('copyButton').addEventListener('click', function() {
  // textarea의 내용을 선택합니다.
  const textarea = document.getElementById('result');
  textarea.select();
  // 선택한 텍스트를 클립보드에 복사합니다.
  document.execCommand('copy');

  // 사용자에게 복사가 완료되었음을 알리는 메시지를 표시합니다.
  alert("클립보드에 복사되었습니다.");
});