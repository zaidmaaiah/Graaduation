const SkillsInput = ({ label, skills, setSkills }) => {
  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={addSkill}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-md transition"
        >
          + Add Skill
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
        {skills.map((skill, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder={`Enter ${label.toLowerCase().replace(' skills', '')} skill`}
            />
            {skills.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
                title="Remove skill"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsInput;